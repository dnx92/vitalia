import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL || '';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vitalia.com' },
    update: {},
    create: {
      email: 'admin@vitalia.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      isAdmin: true,
      wallet: { create: { balance: 100000 } },
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Create test patient
  const patientPassword = await bcrypt.hash('patient123', 12);
  const patient = await prisma.user.upsert({
    where: { email: 'patient@test.com' },
    update: {},
    create: {
      email: 'patient@test.com',
      name: 'John Smith',
      password: patientPassword,
      role: 'PATIENT',
      phone: '+1 555-0101',
      wallet: { create: { balance: 50000 } },
    },
  });
  console.log('✅ Patient created:', patient.email);

  // Create doctors
  const doctors = [
    {
      email: 'elena.martinez@vitalia.com',
      name: 'Dr. Elena Martínez',
      specialty: 'Cardiology',
      title: 'Board-Certified Cardiologist',
      bio: 'Dr. Elena Martínez is a board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. She specializes in preventive cardiology and heart failure management. She received her medical degree from Stanford University and completed her residency at Mayo Clinic.',
      languages: ['Spanish', 'English'],
      yearsExperience: 15,
      hourlyRate: 250,
      rating: 4.9,
      reviewCount: 127,
    },
    {
      email: 'michael.chen@vitalia.com',
      name: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      title: 'Dermatology Specialist',
      bio: 'Dr. Michael Chen is a board-certified dermatologist specializing in both medical and cosmetic dermatology. He has expertise in skin cancer screening, acne treatment, and anti-aging procedures. He graduated from Harvard Medical School.',
      languages: ['English', 'Mandarin'],
      yearsExperience: 12,
      hourlyRate: 200,
      rating: 4.8,
      reviewCount: 89,
    },
    {
      email: 'sarah.johnson@vitalia.com',
      name: 'Dr. Sarah Johnson',
      specialty: 'Pediatrics',
      title: 'Pediatrician',
      bio: 'Dr. Sarah Johnson is a compassionate pediatrician providing comprehensive care for children from newborns to adolescents. She is known for her gentle approach and dedication to child wellness. She trained at Johns Hopkins Hospital.',
      languages: ['English'],
      yearsExperience: 10,
      hourlyRate: 180,
      rating: 4.9,
      reviewCount: 203,
    },
    {
      email: 'david.park@vitalia.com',
      name: 'Dr. David Park',
      specialty: 'Orthopedics',
      title: 'Orthopedic Surgeon',
      bio: 'Dr. David Park is an orthopedic surgeon specializing in sports medicine, joint replacement, and minimally invasive surgery. He has worked with professional athletes and is passionate about helping patients return to an active lifestyle.',
      languages: ['English', 'Korean'],
      yearsExperience: 18,
      hourlyRate: 300,
      rating: 4.8,
      reviewCount: 156,
    },
    {
      email: 'maria.garcia@vitalia.com',
      name: 'Dr. Maria Garcia',
      specialty: 'Neurology',
      title: 'Neurologist',
      bio: 'Dr. Maria Garcia is a neurologist specializing in headache disorders, epilepsy, and movement disorders. She completed her fellowship at Cleveland Clinic and has published numerous research papers on neurological conditions.',
      languages: ['Spanish', 'English'],
      yearsExperience: 14,
      hourlyRate: 280,
      rating: 4.7,
      reviewCount: 78,
    },
    {
      email: 'james.wilson@vitalia.com',
      name: 'Dr. James Wilson',
      specialty: 'Internal Medicine',
      title: 'Internist',
      bio: "Dr. James Wilson is an internist focused on preventive care and chronic disease management. He believes in a holistic approach to healthcare and takes time to understand each patient's unique needs.",
      languages: ['English'],
      yearsExperience: 20,
      hourlyRate: 160,
      rating: 4.9,
      reviewCount: 312,
    },
  ];

  for (const doc of doctors) {
    const password = await bcrypt.hash('doctor123', 12);
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: {},
      create: {
        email: doc.email,
        name: doc.name,
        password: password,
        role: 'PROFESSIONAL',
        wallet: { create: { balance: 0 } },
        professional: {
          create: {
            title: doc.title,
            specialty: doc.specialty,
            bio: doc.bio,
            languages: doc.languages,
            yearsExperience: doc.yearsExperience,
            hourlyRate: doc.hourlyRate,
            rating: doc.rating,
            reviewCount: doc.reviewCount,
            verificationStatus: 'APPROVED',
          },
        },
      },
      include: { professional: true },
    });

    // Create services for each doctor
    const services = [
      {
        title: `${doc.specialty} Consultation`,
        description: `Comprehensive ${doc.specialty.toLowerCase()} assessment including physical examination and personalized treatment plan.`,
        price: doc.hourlyRate * 100,
        duration: 60,
        category: doc.specialty,
      },
      {
        title: 'Follow-up Visit',
        description:
          'Post-consultation follow-up to monitor progress and adjust treatment as needed.',
        price: doc.hourlyRate * 100 * 0.6,
        duration: 30,
        category: doc.specialty,
      },
    ];

    for (const service of services) {
      await prisma.service.upsert({
        where: {
          id: `${user.professional!.id}-${service.title.toLowerCase().replace(/\s/g, '-')}`,
        },
        update: {},
        create: {
          id: `${user.professional!.id}-${service.title.toLowerCase().replace(/\s/g, '-')}`,
          professionalId: user.professional!.id,
          title: service.title,
          description: service.description,
          price: Math.round(service.price),
          duration: service.duration,
          category: service.category,
          isActive: true,
        },
      });
    }

    console.log('✅ Doctor created:', doc.email);
  }

  // Create some sample health metrics for the patient
  const healthMetrics = [
    { type: 'blood_pressure', value: 120, unit: 'mmHg' },
    { type: 'heart_rate', value: 72, unit: 'bpm' },
    { type: 'weight', value: 70, unit: 'kg' },
    { type: 'blood_sugar', value: 95, unit: 'mg/dL' },
  ];

  for (const metric of healthMetrics) {
    await prisma.healthMetric.create({
      data: {
        userId: patient.id,
        type: metric.type,
        value: metric.value,
        unit: metric.unit,
        recordedAt: new Date(),
      },
    });
  }
  console.log('✅ Health metrics created for patient');

  // Create sample appointments for the patient
  const elenaDoctor = await prisma.user.findFirst({
    where: { email: 'elena.martinez@vitalia.com' },
    include: { professional: true },
  });

  const michaelDoctor = await prisma.user.findFirst({
    where: { email: 'michael.chen@vitalia.com' },
    include: { professional: true },
  });

  if (elenaDoctor?.professional) {
    const elenaService = await prisma.service.findFirst({
      where: { professionalId: elenaDoctor.professional.id },
    });

    if (elenaService) {
      await prisma.appointment.create({
        data: {
          patientId: patient.id,
          professionalId: elenaDoctor.professional.id,
          serviceId: elenaService.id,
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          startTime: '10:00',
          endTime: '11:00',
          status: 'CONFIRMED',
          totalAmount: elenaService.price,
          notes: 'Annual heart checkup',
        },
      });
      console.log('✅ Sample appointment created: Elena (upcoming)');
    }
  }

  if (michaelDoctor?.professional) {
    const michaelService = await prisma.service.findFirst({
      where: { professionalId: michaelDoctor.professional.id },
    });

    if (michaelService) {
      await prisma.appointment.create({
        data: {
          patientId: patient.id,
          professionalId: michaelDoctor.professional.id,
          serviceId: michaelService.id,
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
          startTime: '14:00',
          endTime: '15:00',
          status: 'COMPLETED',
          totalAmount: michaelService.price,
          notes: 'Skin consultation',
        },
      });
      console.log('✅ Sample appointment created: Michael (completed)');
    }
  }

  console.log('\n🎉 Seeding completed!');
  console.log('\n📋 Test accounts:');
  console.log('   Admin:    admin@vitalia.com / admin123');
  console.log('   Patient:  patient@test.com / patient123');
  console.log('   Doctor:   elena.martinez@vitalia.com / doctor123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
