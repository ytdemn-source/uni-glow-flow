
CREATE POLICY "Public can read note files"
ON storage.objects FOR SELECT
USING (bucket_id = 'note-files');
