
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";

const Gallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const galleries = {
    "1": {
      title: "Nature",
      images: [
        "https://images.unsplash.com/photo-1472396961693-142e6e269027",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f"
      ]
    },
    "2": {
      title: "Urban",
      images: [
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
        "https://images.unsplash.com/photo-1444723121867-7a241cacace9",
        "https://images.unsplash.com/photo-1460472178825-e5240623afd5"
      ]
    },
    "3": {
      title: "Abstract",
      images: [
        "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
        "https://images.unsplash.com/photo-1507838153414-b4b713384a76",
        "https://images.unsplash.com/photo-1496737018672-b1a6be2e949c"
      ]
    },
    "4": {
      title: "Waterfall",
      images: [
        "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
        "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
        "https://images.unsplash.com/photo-1504198322253-cfa87a0ff25f",
        "https://images.unsplash.com/photo-1498855926480-d98e83099315"
      ]
    },
    "5": {
      title: "Mountains",
      images: [
        "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
        "https://images.unsplash.com/photo-1456428199391-a3b1cb5e93ab",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba"
      ]
    }
  };

  const gallery = galleries[id as keyof typeof galleries];

  if (!gallery) {
    return <div>Gallery not found</div>;
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{gallery.title} Gallery</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {gallery.images.map((image, index) => (
            <div key={index} className="aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={image}
                alt={`${gallery.title} ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Gallery;
