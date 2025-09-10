import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/ImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Calculator, Camera, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MalariaImage {
  id: string;
  file_path: string;
  file_name: string;
  description: string | null;
  uploaded_at: string;
}

const Malaria = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [images, setImages] = useState<MalariaImage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Index calculation state
  const [housesInspected, setHousesInspected] = useState('');
  const [housesWithLarvae, setHousesWithLarvae] = useState('');
  const [containersInspected, setContainersInspected] = useState('');
  const [containersWithLarvae, setContainersWithLarvae] = useState('');
  const [positiveContainers, setPositiveContainers] = useState('');
  
  const [houseIndex, setHouseIndex] = useState<number | null>(null);
  const [containerIndex, setContainerIndex] = useState<number | null>(null);
  const [breteauIndex, setBreteauIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchMalariaImages();
  }, []);

  const fetchMalariaImages = async () => {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('disease', 'malaria')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch images',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateIndices = async () => {
    const housesInsp = parseInt(housesInspected);
    const housesLarvae = parseInt(housesWithLarvae);
    const containersInsp = parseInt(containersInspected);
    const containersLarvae = parseInt(containersWithLarvae);
    const posContainers = parseInt(positiveContainers);

    if (housesInsp && housesLarvae !== undefined) {
      const hi = (housesLarvae / housesInsp) * 100;
      setHouseIndex(Math.round(hi * 100) / 100);
    }

    if (containersInsp && containersLarvae !== undefined) {
      const ci = (containersLarvae / containersInsp) * 100;
      setContainerIndex(Math.round(ci * 100) / 100);
    }

    if (housesInsp && posContainers !== undefined) {
      const bi = (posContainers / housesInsp) * 100;
      setBreteauIndex(Math.round(bi * 100) / 100);
    }

    // Save to database
    try {
      if (user && (houseIndex !== null || containerIndex !== null || breteauIndex !== null)) {
        const inputData = {
          housesInspected: housesInsp,
          housesWithLarvae,
          containersInspected: containersInsp,
          containersWithLarvae,
          positiveContainers: posContainers,
        };

        if (houseIndex !== null) {
          await supabase.from('disease_indices').insert({
            user_id: user.id,
            disease: 'malaria',
            index_type: 'house_index',
            calculated_value: houseIndex,
            input_data: inputData,
          });
        }

        if (containerIndex !== null) {
          await supabase.from('disease_indices').insert({
            user_id: user.id,
            disease: 'malaria',
            index_type: 'container_index',
            calculated_value: containerIndex,
            input_data: inputData,
          });
        }

        if (breteauIndex !== null) {
          await supabase.from('disease_indices').insert({
            user_id: user.id,
            disease: 'malaria',
            index_type: 'breteau_index',
            calculated_value: breteauIndex,
            input_data: inputData,
          });
        }

        toast({
          title: 'Success!',
          description: 'Indices calculated and saved successfully.',
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save indices',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Activity className="h-12 w-12 text-malaria" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Malaria Surveillance</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Upload mosquito images and calculate malaria vector indices to monitor disease transmission risk.
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Upload Images</TabsTrigger>
          <TabsTrigger value="gallery">Image Gallery</TabsTrigger>
          <TabsTrigger value="calculate">Calculate Indices</TabsTrigger>
          <TabsTrigger value="detection">AI Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <ImageUpload diseaseType="malaria" onUploadSuccess={fetchMalariaImages} />
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Malaria Image Gallery</span>
              </CardTitle>
              <CardDescription>
                View all uploaded mosquito surveillance images
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center text-muted-foreground">Loading images...</p>
              ) : images.length === 0 ? (
                <p className="text-center text-muted-foreground">No images uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="aspect-square">
                        <img
                          src={image.file_path}
                          alt={image.file_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium truncate">{image.file_name}</h4>
                        {image.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {image.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(image.uploaded_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Index Calculations</span>
                </CardTitle>
                <CardDescription>
                  Input field data to calculate malaria vector indices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Houses Inspected</Label>
                    <Input
                      type="number"
                      value={housesInspected}
                      onChange={(e) => setHousesInspected(e.target.value)}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Houses with Larvae</Label>
                    <Input
                      type="number"
                      value={housesWithLarvae}
                      onChange={(e) => setHousesWithLarvae(e.target.value)}
                      placeholder="25"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Containers Inspected</Label>
                    <Input
                      type="number"
                      value={containersInspected}
                      onChange={(e) => setContainersInspected(e.target.value)}
                      placeholder="500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Containers with Larvae</Label>
                    <Input
                      type="number"
                      value={containersWithLarvae}
                      onChange={(e) => setContainersWithLarvae(e.target.value)}
                      placeholder="75"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Positive Containers</Label>
                  <Input
                    type="number"
                    value={positiveContainers}
                    onChange={(e) => setPositiveContainers(e.target.value)}
                    placeholder="75"
                  />
                </div>

                <Button onClick={calculateIndices} className="w-full bg-malaria hover:bg-malaria/90">
                  Calculate Indices
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Calculated Results</span>
                </CardTitle>
                <CardDescription>
                  Malaria vector surveillance indices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">House Index</span>
                      <span className="text-lg font-bold text-malaria">
                        {houseIndex !== null ? `${houseIndex}%` : '--'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Percentage of houses with larval habitats
                    </p>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Container Index</span>
                      <span className="text-lg font-bold text-malaria">
                        {containerIndex !== null ? `${containerIndex}%` : '--'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Percentage of containers with larvae
                    </p>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Breteau Index</span>
                      <span className="text-lg font-bold text-malaria">
                        {breteauIndex !== null ? `${breteauIndex}%` : '--'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Positive containers per 100 houses
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Detection Results</CardTitle>
              <CardDescription>
                Future AI integration for automated mosquito species detection
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <div className="space-y-4">
                <Activity className="h-16 w-16 text-muted-foreground mx-auto" />
                <h3 className="text-xl font-semibold text-muted-foreground">
                  AI Detection Placeholder
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  This section will be integrated with AI models for automatic 
                  mosquito species identification and larval detection in the future.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Malaria;