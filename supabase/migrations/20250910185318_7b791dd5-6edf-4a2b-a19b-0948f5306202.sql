-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create images table for disease surveillance uploads
CREATE TABLE public.images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  disease TEXT NOT NULL CHECK (disease IN ('malaria', 'leptospirosis')),
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  description TEXT,
  detection_results JSONB,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indices calculations table for malaria and leptospirosis data
CREATE TABLE public.disease_indices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  disease TEXT NOT NULL CHECK (disease IN ('malaria', 'leptospirosis')),
  index_type TEXT NOT NULL,
  calculated_value DECIMAL(5,2),
  input_data JSONB NOT NULL,
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_indices ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for images table
CREATE POLICY "Users can view all images" 
ON public.images 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own images" 
ON public.images 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own images" 
ON public.images 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images" 
ON public.images 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for disease_indices table
CREATE POLICY "Users can view all indices" 
ON public.disease_indices 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own indices" 
ON public.disease_indices 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own indices" 
ON public.disease_indices 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create storage bucket for surveillance images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('surveillance-images', 'surveillance-images', false);

-- Create storage policies for surveillance images
CREATE POLICY "Users can view surveillance images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'surveillance-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can upload surveillance images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'surveillance-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their surveillance images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'surveillance-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their surveillance images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'surveillance-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email), 
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();