import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Bird } from '../services/bird';

interface Prediction {
  species: string;
  probability: number;
}

interface ApiResponse {
  model: string;
  predictions: Prediction[];
}

interface DisplayPrediction {
  species: string;
  confidence: number;
  description: string;
}

@Component({
  selector: 'app-bird-identify',
  imports: [CommonModule, FormsModule],
  templateUrl: './bird-identify.html',
  styleUrl: './bird-identify.css'
})
export class BirdIdentify {
  private birdService = inject(Bird);

  selectedImage: string | null = null;
  selectedFile: File | null = null;
  selectedModel: string = 'library'; // Default to library model
  isDragOver = false;
  isLoading = false;
  prediction: DisplayPrediction | null = null;
  error: string | null = null;

  // Bird descriptions database for enhanced display
  private birdDescriptions: { [key: string]: string } = {
    'Cardinal': 'A vibrant red songbird native to North America. Males display bright red plumage while females show warm brown tones with red highlights.',
    'Blue Jay': 'An intelligent corvid known for its striking blue coloration, distinctive crest, and complex social behaviors.',
    'Sparrow': 'Small, brown and gray songbirds found worldwide, known for their adaptability and social flocking behavior.',
    'American Robin': 'A familiar thrush with an orange-red breast, considered a harbinger of spring across much of North America.',
    'Crow': 'Highly intelligent black birds known for their problem-solving abilities and complex social structures.',
    'Eagle': 'Magnificent birds of prey with powerful talons and exceptional eyesight, symbols of strength and freedom.',
    'Hawk': 'Swift predatory birds with keen eyesight and powerful flight capabilities, excellent hunters in their ecosystems.',
    'Owl': 'Nocturnal hunters with exceptional hearing and silent flight, featuring distinctive facial discs and large eyes.',
    'Woodpecker': 'Specialized birds that drum on trees to find insects, with strong bills and shock-absorbing skulls.',
    'Hummingbird': 'Tiny, iridescent birds capable of hovering flight, with rapid wing beats and specialized feeding habits.'
  };

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  private handleFile(file: File) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.error = 'Please select a valid image file.';
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      this.error = 'File size must be less than 10MB.';
      return;
    }

    this.error = null;
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImage = e.target?.result as string;
      this.prediction = null;
    };
    reader.readAsDataURL(file);
  }

  // Unified prediction method that uses the selected model
  predictSpecies() {
    if (!this.selectedFile) {
      this.error = 'Please select an image first.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Create FormData for API call
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // Call the appropriate API based on selected model
    let apiCall;

    if (this.selectedModel === 'mobilenet') {
      apiCall = this.birdService.mobileNetPredict(formData);
    } else if (this.selectedModel === 'scratch') {
      apiCall = this.birdService.scratchPredict(formData);
    } else {
      apiCall = this.birdService.libraryModelPredict(formData);
    }

    apiCall.subscribe({
      next: (response: ApiResponse) => {
        this.handleApiResponse(response);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('API Error:', error);
        this.error = 'Failed to identify the bird. Please try again.';
        this.isLoading = false;
      }
    });

  }

  // Method to get the display name of the selected model
  getSelectedModelName(): string {
    switch (this.selectedModel) {
      case 'library':
        return 'Bird Specialist Model';
      case 'mobilenet':
        return 'MobileNet Vision Model';
      case 'scratch':
        return 'Scratch CNN Model';
      default:
        return 'Unknown Model';
    }
  }


  private handleApiResponse(response: ApiResponse) {
    if (response.predictions && response.predictions.length > 0) {
      // Get the prediction with highest probability
      const topPrediction = response.predictions.reduce((prev, current) =>
        (prev.probability > current.probability) ? prev : current
      );

      // Convert probability to percentage
      const confidence = Math.round(topPrediction.probability * 100);

      // Get description for the species
      const description = this.getSpeciesDescription(topPrediction.species);

      this.prediction = {
        species: topPrediction.species,
        confidence: confidence,
        description: description
      };
    } else {
      this.error = 'No bird species could be identified in the image.';
    }
  }

  private getSpeciesDescription(species: string): string {
    // Try to find exact match first
    if (this.birdDescriptions[species]) {
      return this.birdDescriptions[species];
    }

    // Try to find partial match (case-insensitive)
    const lowerSpecies = species.toLowerCase();
    for (const [key, description] of Object.entries(this.birdDescriptions)) {
      if (key.toLowerCase().includes(lowerSpecies) || lowerSpecies.includes(key.toLowerCase())) {
        return description;
      }
    }

    // Return generic description if no match found
    return `A ${species} is a unique bird species with distinctive characteristics and behaviors that make it special in the avian world.`;
  }

  clearImage() {
    this.selectedImage = null;
    this.selectedFile = null;
    this.prediction = null;
    this.isLoading = false;
    this.error = null;
  }
}