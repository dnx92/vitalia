import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const mockProfessional = {
      id: '1',
      name: 'Dr. Elena Martínez',
      specialty: 'Cardiology',
      bio: 'Dr. Elena Martínez is a board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. She specializes in preventive cardiology and heart failure management. Dr. Martínez received her medical degree from the Universidad Complutense de Madrid and completed her residency at Hospital Clínico San Carlos.',
      location: 'Madrid, Spain',
      rating: 4.9,
      reviewCount: 127,
      languages: ['Spanish', 'English', 'Portuguese'],
      verified: true,
      verificationStatus: 'VERIFIED',
      avatar: null,
      services: [
        {
          id: 's1',
          title: 'Cardiology Consultation',
          description:
            'Comprehensive cardiovascular assessment including physical examination, ECG review, and personalized treatment plan.',
          price: 15000,
          duration: 45,
          location: 'Madrid Clinic, Spain',
        },
        {
          id: 's2',
          title: 'Follow-up Visit',
          description:
            'Post-consultation follow-up to monitor progress and adjust treatment as needed.',
          price: 8000,
          duration: 20,
          location: 'Madrid Clinic, Spain',
        },
      ],
      availability: {
        monday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        tuesday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
        wednesday: ['10:00', '11:00', '14:00', '15:00', '16:00'],
        thursday: ['09:00', '10:00', '11:00', '14:00'],
        friday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
      },
      reviews: [
        {
          id: 'r1',
          userName: 'María García',
          rating: 5,
          comment:
            'Dr. Martínez is an excellent cardiologist. She took the time to explain everything clearly and made me feel very comfortable.',
          date: '2024-01-15',
        },
        {
          id: 'r2',
          userName: 'John Smith',
          rating: 5,
          comment:
            'Very professional and knowledgeable. The consultation was thorough and I felt confident in her care.',
          date: '2024-01-10',
        },
      ],
    };

    return NextResponse.json(mockProfessional);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json({ error: 'Failed to fetch service details' }, { status: 500 });
  }
}
