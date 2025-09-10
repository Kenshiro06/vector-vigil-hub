import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Activity, Shield, TrendingUp, Users, AlertTriangle, Eye } from 'lucide-react';

const Index = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="flex justify-center">
          <Activity className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-5xl font-bold text-foreground">
          Malaria & Leptospirosis 
          <span className="text-primary block">Surveillance System</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          A comprehensive digital platform for monitoring and tracking vector-borne diseases. 
          Upload surveillance images, calculate disease indices, and contribute to public health monitoring efforts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth">
            <Button size="lg" className="min-w-32">
              Get Started
            </Button>
          </Link>
          <Link to="#about">
            <Button variant="outline" size="lg" className="min-w-32">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Disease Information Section */}
      <section id="about" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Malaria Card */}
        <Card className="border-malaria/20 hover:border-malaria/40 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-malaria" />
              <span className="text-2xl">Malaria Surveillance</span>
            </CardTitle>
            <CardDescription className="text-base">
              Monitor mosquito populations and assess malaria transmission risk
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">What is Malaria?</h4>
              <p className="text-muted-foreground">
                Malaria is a life-threatening disease caused by parasites transmitted through 
                infected female Anopheles mosquitoes. It remains one of the world's leading 
                causes of illness and death, particularly in tropical regions.
              </p>
              
              <h4 className="font-semibold text-lg">Prevention Methods</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                  <span>Use insecticide-treated bed nets while sleeping</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                  <span>Apply mosquito repellents containing DEET</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                  <span>Eliminate standing water where mosquitoes breed</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                  <span>Wear long-sleeved clothing during peak hours</span>
                </li>
              </ul>

              <h4 className="font-semibold text-lg">Surveillance Indices</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>House Index:</strong> Percentage of houses with larval habitats</li>
                <li>• <strong>Container Index:</strong> Percentage of containers with larvae</li>
                <li>• <strong>Breteau Index:</strong> Positive containers per 100 houses</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Leptospirosis Card */}
        <Card className="border-leptospirosis/20 hover:border-leptospirosis/40 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-leptospirosis" />
              <span className="text-2xl">Leptospirosis Surveillance</span>
            </CardTitle>
            <CardDescription className="text-base">
              Track rodent populations and environmental risk factors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">What is Leptospirosis?</h4>
              <p className="text-muted-foreground">
                Leptospirosis is a bacterial infection caused by Leptospira bacteria, 
                commonly transmitted through contact with contaminated water or soil, 
                often from infected rodent urine.
              </p>
              
              <h4 className="font-semibold text-lg">Prevention Methods</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                  <span>Avoid swimming or wading in contaminated water</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                  <span>Wear protective clothing in high-risk areas</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                  <span>Control rodent populations around homes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                  <span>Maintain proper sanitation and drainage</span>
                </li>
              </ul>

              <h4 className="font-semibold text-lg">Risk Factors</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Flooding and poor drainage systems</li>
                <li>• Contact with contaminated water bodies</li>
                <li>• Presence of infected rodents</li>
                <li>• Poor sanitation conditions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Project Purpose Section */}
      <section className="text-center space-y-6 py-8 bg-muted/50 rounded-lg">
        <h2 className="text-3xl font-bold">Project Purpose</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="space-y-3">
            <Eye className="h-12 w-12 text-primary mx-auto" />
            <h3 className="text-xl font-semibold">Disease Monitoring</h3>
            <p className="text-muted-foreground">
              Continuously monitor disease vectors and environmental risk factors to 
              prevent outbreaks and protect community health.
            </p>
          </div>
          <div className="space-y-3">
            <TrendingUp className="h-12 w-12 text-primary mx-auto" />
            <h3 className="text-xl font-semibold">Data Analysis</h3>
            <p className="text-muted-foreground">
              Calculate surveillance indices and analyze trends to provide 
              actionable insights for public health decision making.
            </p>
          </div>
          <div className="space-y-3">
            <AlertTriangle className="h-12 w-12 text-primary mx-auto" />
            <h3 className="text-xl font-semibold">Early Warning</h3>
            <p className="text-muted-foreground">
              Enable early detection of disease transmission risks to facilitate 
              rapid response and intervention strategies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
