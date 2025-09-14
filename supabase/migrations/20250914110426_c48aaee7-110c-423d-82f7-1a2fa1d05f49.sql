-- Fix critical security vulnerability: Restrict data access to user's own records only

-- Update images table SELECT policy to restrict to user's own data
DROP POLICY IF EXISTS "Users can view all images" ON public.images;
CREATE POLICY "Users can view their own images" 
ON public.images 
FOR SELECT 
USING (auth.uid() = user_id);

-- Update disease_indices table SELECT policy to restrict to user's own data  
DROP POLICY IF EXISTS "Users can view all indices" ON public.disease_indices;
CREATE POLICY "Users can view their own indices" 
ON public.disease_indices 
FOR SELECT 
USING (auth.uid() = user_id);

-- Make surveillance-images storage bucket public to work with getPublicUrl()
UPDATE storage.buckets 
SET public = true 
WHERE id = 'surveillance-images';

-- Add storage policies for surveillance-images bucket
INSERT INTO storage.objects (bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata) VALUES ('surveillance-images', '.emptyFolderPlaceholder', null, now(), now(), now(), '{}') ON CONFLICT DO NOTHING;

-- Create storage policy to allow users to view images in their own folder
CREATE POLICY "Users can view images in their own folder" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'surveillance-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Create storage policy to allow users to insert images in their own folder
CREATE POLICY "Users can upload images to their own folder" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'surveillance-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Create storage policy to allow users to update images in their own folder
CREATE POLICY "Users can update images in their own folder" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'surveillance-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Create storage policy to allow users to delete images in their own folder
CREATE POLICY "Users can delete images in their own folder" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'surveillance-images' AND (storage.foldername(name))[1] = auth.uid()::text);