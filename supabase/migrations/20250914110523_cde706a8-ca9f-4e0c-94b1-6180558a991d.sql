-- Make surveillance-images storage bucket public to work with getPublicUrl()
UPDATE storage.buckets 
SET public = true 
WHERE id = 'surveillance-images';

-- Create storage policies for surveillance-images bucket (if they don't exist)
DO $$
BEGIN
    -- Create storage policy to allow users to view images in their own folder
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Users can view images in their own folder'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can view images in their own folder" 
        ON storage.objects 
        FOR SELECT 
        USING (bucket_id = ''surveillance-images'' AND (storage.foldername(name))[1] = auth.uid()::text)';
    END IF;

    -- Create storage policy to allow users to insert images in their own folder
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Users can upload images to their own folder'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can upload images to their own folder" 
        ON storage.objects 
        FOR INSERT 
        WITH CHECK (bucket_id = ''surveillance-images'' AND (storage.foldername(name))[1] = auth.uid()::text)';
    END IF;

    -- Create storage policy to allow users to update images in their own folder
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Users can update images in their own folder'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can update images in their own folder" 
        ON storage.objects 
        FOR UPDATE 
        USING (bucket_id = ''surveillance-images'' AND (storage.foldername(name))[1] = auth.uid()::text)';
    END IF;

    -- Create storage policy to allow users to delete images in their own folder
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Users can delete images in their own folder'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can delete images in their own folder" 
        ON storage.objects 
        FOR DELETE 
        USING (bucket_id = ''surveillance-images'' AND (storage.foldername(name))[1] = auth.uid()::text)';
    END IF;
END
$$;