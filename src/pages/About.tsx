
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <Card>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">About Me</h2>
                <p className="text-muted-foreground leading-relaxed">
                  I'm a passionate photographer based in New York, specializing in landscape and urban photography. 
                  With over 5 years of experience, I strive to capture the beauty in both natural and man-made environments.
                </p>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>New York, USA</span>
                </div>
              </div>
              <div className="image-container rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                  alt="Profile"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;
