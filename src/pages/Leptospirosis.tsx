import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/ImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Users, Calculator, Camera, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LeptospirosisImage {
  id: string;
  file_path: string;
  file_name: string;
  description: string | null;
  uploaded_at: string;
}

const Leptospirosis = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [images, setImages] = useState<LeptospirosisImage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Index calculation state
  const [locationsInspected, setLocationsInspected] = useState('');
  const [locationsWithRodents, setLocationsWithRodents] = useState('');
  const [totalRodentsCaught, setTotalRodentsCaught] = useState('');
  const [infectedRodents, setInfectedRodents] = useState('');
  
  const [rodentIndex, setRodentIndex] = useState<number | null>(null);
  const [infectionRate, setInfectionRate] = useState<number | null>(null);
  const [riskLevel, setRiskLevel] = useState<string>('');

  useEffect(() => {
    fetchLeptospirosisImages();
  }, []);

  const fetchLeptospirosisImages = async () => {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('disease', 'leptospirosis')
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
    const locationsInsp = parseInt(locationsInspected);
    const locationsRodents = parseInt(locationsWithRodents);
    const totalRodents = parseInt(totalRodentsCaught);
    const infected = parseInt(infectedRodents);

    let calculatedRodentIndex = null;
    let calculatedInfectionRate = null;
    let calculatedRiskLevel = '';

    // Calculate Rodent Index (percentage of locations with rodent signs)
    if (locationsInsp && locationsRodents !== undefined) {
      calculatedRodentIndex = (locationsRodents / locationsInsp) * 100;
      setRodentIndex(Math.round(calculatedRodentIndex * 100) / 100);
    }

    // Calculate Infection Rate (percentage of infected rodents)
    if (totalRodents && infected !== undefined) {
      calculatedInfectionRate = (infected / totalRodents) * 100;
      setInfectionRate(Math.round(calculatedInfectionRate * 100) / 100);
    }

    // Determine Risk Level
    if (calculatedRodentIndex !== null) {
      if (calculatedRodentIndex < 10) {
        calculatedRiskLevel = 'Low Risk';
      } else if (calculatedRodentIndex < 30) {
        calculatedRiskLevel = 'Medium Risk';
      } else {
        calculatedRiskLevel = 'High Risk';
      }
      setRiskLevel(calculatedRiskLevel);
    }

    // Save to database
    try {
      if (user && (calculatedRodentIndex !== null || calculatedInfectionRate !== null)) {
        const inputData = {
          locationsInspected: locationsInsp,
          locationsWithRodents,
          totalRodentsCaught: totalRodents,
          infectedRodents: infected,
        };

        if (calculatedRodentIndex !== null) {
          await supabase.from('disease_indices').insert({
            user_id: user.id,
            disease: 'leptospirosis',
            index_type: 'rodent_index',
            calculated_value: calculatedRodentIndex,
            input_data: inputData,
          });
        }

        if (calculatedInfectionRate !== null) {
          await supabase.from('disease_indices').insert({
            user_id: user.id,
            disease: 'leptospirosis',
            index_type: 'infection_rate',
            calculated_value: calculatedInfectionRate,
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

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low Risk':
        return 'text-success';
      case 'Medium Risk':
        return 'text-warning';
      case 'High Risk':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Users className="h-12 w-12 text-leptospirosis" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Leptospirosis Surveillance</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Upload rodent and environmental images and calculate leptospirosis risk indices.
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
          <ImageUpload diseaseType="leptospirosis" onUploadSuccess={fetchLeptospirosisImages} />
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Leptospirosis Image Gallery</span>
              </CardTitle>
              <CardDescription>
                View all uploaded rodent and environmental surveillance images
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
                  <span>Risk Index Calculations</span>
                </CardTitle>
                <CardDescription>
                  Input field data to calculate leptospirosis risk indices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Locations Inspected</Label>
                    <Input
                      type="number"
                      value={locationsInspected}
                      onChange={(e) => setLocationsInspected(e.target.value)}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Locations with Rodent Signs</Label>
                    <Input
                      type="number"
                      value={locationsWithRodents}
                      onChange={(e) => setLocationsWithRodents(e.target.value)}
                      placeholder="15"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Total Rodents Caught</Label>
                    <Input
                      type="number"
                      value={totalRodentsCaught}
                      onChange={(e) => setTotalRodentsCaught(e.target.value)}
                      placeholder="30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Infected Rodents</Label>
                    <Input
                      type="number"
                      value={infectedRodents}
                      onChange={(e) => setInfectedRodents(e.target.value)}
                      placeholder="5"
                    />
                  </div>
                </div>

                <Button onClick={calculateIndices} className="w-full bg-leptospirosis hover:bg-leptospirosis/90">
                  Calculate Risk Indices
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
                  Leptospirosis risk assessment indices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Rodent Index</span>
                      <span className="text-lg font-bold text-leptospirosis">
                        {rodentIndex !== null ? `${rodentIndex}%` : '--'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Percentage of locations with rodent signs
                    </p>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Infection Rate</span>
                      <span className="text-lg font-bold text-leptospirosis">
                        {infectionRate !== null ? `${infectionRate}%` : '--'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Percentage of infected rodents
                    </p>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Risk Level</span>
                      <span className={`text-lg font-bold ${getRiskLevelColor(riskLevel)}`}>
                        {riskLevel || '--'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Overall leptospirosis transmission risk
                    </p>
                  </div>
                </div>

                {riskLevel && (
                  <div className="mt-4 p-4 bg-accent/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Risk Assessment Guide</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Low Risk (&lt;10%):</strong> Minimal intervention needed</li>
                      <li>• <strong>Medium Risk (10-30%):</strong> Enhanced monitoring recommended</li>
                      <li>• <strong>High Risk (&gt;30%):</strong> Immediate control measures required</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Detection Results</CardTitle>
              <CardDescription>
                Future AI integration for automated rodent species detection and environmental analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <div className="space-y-4">
                <Users className="h-16 w-16 text-muted-foreground mx-auto" />
                <h3 className="text-xl font-semibold text-muted-foreground">
                  AI Detection Placeholder
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  This section will be integrated with AI models for automatic 
                  rodent species identification and environmental risk assessment in the future.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leptospirosis;