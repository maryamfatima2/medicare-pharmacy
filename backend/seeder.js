import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Category from './models/Category.js';
import Medicine from './models/Medicine.js';
import connectDB from './config/db.js';
import { img } from './constants/medicineImages.js';

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Medicine.deleteMany();

    await User.create({
      name: 'Admin',
      email: 'admin@healora.com',
      password: 'admin123',
      role: 'admin',
      phone: '0300-1234567',
    });

    await User.create({
      name: 'John Doe',
      email: 'john@healora.com',
      password: 'user123',
      role: 'user',
      phone: '0311-7654321',
    });

    const categories = await Category.insertMany([
      { name: 'Pain Relief', description: 'Painkillers and anti-inflammatory medicines', icon: '💊' },
      { name: 'Antibiotics', description: 'Antibacterial and antimicrobial medicines', icon: '🦠' },
      { name: 'Vitamins & Supplements', description: 'Daily vitamins and health supplements', icon: '🌟' },
      { name: 'Skin Care', description: 'Dermatological products and creams', icon: '🧴' },
      { name: 'Cough & Cold', description: 'Cold, flu and respiratory medicines', icon: '🤧' },
      { name: 'Diabetes Care', description: 'Insulin and diabetes management', icon: '💉' },
      { name: 'Heart Health', description: 'Cardiovascular medicines', icon: '❤️' },
      { name: 'Digestive Health', description: 'Stomach and digestive system medicines', icon: '🫁' },
      { name: 'Eye & Ear Care', description: 'Ophthalmic and otic preparations', icon: '👁️' },
      { name: 'First Aid', description: 'Bandages, antiseptics and wound care', icon: '🩹' },
    ]);

    const catMap = {};
    categories.forEach((c) => { catMap[c.name] = c._id; });

    const medicines = [
      // Pain Relief
      { name: 'Panadol Extra', genericName: 'Paracetamol + Caffeine', description: 'Fast-acting pain relief tablets for headache, toothache, and body pain.', price: 150, discountPrice: 120, category: catMap['Pain Relief'], manufacturer: 'GSK', stock: 200, dosageForm: 'Tablet', strength: '500mg', packSize: 'Pack of 10', isFeatured: true, isBestSeller: true, averageRating: 4.5, numReviews: 24, soldCount: 150, tags: ['pain', 'headache', 'fever'] },
      { name: 'Brufen 400', genericName: 'Ibuprofen', description: 'Anti-inflammatory painkiller for muscle pain, arthritis, and joint inflammation.', price: 200, discountPrice: 0, category: catMap['Pain Relief'], manufacturer: 'Abbott', stock: 150, dosageForm: 'Tablet', strength: '400mg', packSize: 'Pack of 20', isFeatured: true, averageRating: 4.2, numReviews: 18, soldCount: 90, tags: ['pain', 'inflammation'] },
      { name: 'Ponstan Forte', genericName: 'Mefenamic Acid', description: 'Pain relief for dental pain, muscle aches, and menstrual cramps.', price: 180, discountPrice: 0, category: catMap['Pain Relief'], manufacturer: 'Pfizer', stock: 100, dosageForm: 'Tablet', strength: '500mg', packSize: 'Pack of 20', averageRating: 4.6, numReviews: 15, soldCount: 80, tags: ['pain', 'cramps'] },
      { name: 'Disprin', genericName: 'Aspirin', description: 'Soluble tablets for headache and mild fever.', price: 50, discountPrice: 0, category: catMap['Pain Relief'], manufacturer: 'Reckitt', stock: 300, dosageForm: 'Tablet', strength: '300mg', packSize: 'Pack of 30', averageRating: 4.4, numReviews: 30, soldCount: 200, tags: ['pain', 'headache'] },
      { name: 'Nuberol Forte', genericName: 'Paracetamol + Orphenadrine', description: 'Muscle relaxant and painkiller.', price: 220, discountPrice: 190, category: catMap['Pain Relief'], manufacturer: 'Searle', stock: 50, dosageForm: 'Tablet', strength: '650mg', packSize: 'Pack of 15', averageRating: 4.1, numReviews: 10, soldCount: 60, tags: ['pain', 'muscle'] },

      // Antibiotics
      { name: 'Augmentin 625', genericName: 'Amoxicillin + Clavulanate', description: 'Broad-spectrum antibiotic for bacterial infections.', price: 850, discountPrice: 780, category: catMap['Antibiotics'], manufacturer: 'GSK', stock: 80, dosageForm: 'Tablet', strength: '625mg', packSize: 'Pack of 6', requiresPrescription: true, isFeatured: true, averageRating: 4.7, numReviews: 32, soldCount: 200, tags: ['antibiotic', 'infection'] },
      { name: 'Amoxil 500', genericName: 'Amoxicillin', description: 'Antibiotic for chest, throat, and skin infections.', price: 300, discountPrice: 0, category: catMap['Antibiotics'], manufacturer: 'GSK', stock: 120, dosageForm: 'Capsule', strength: '500mg', packSize: 'Pack of 12', requiresPrescription: true, averageRating: 4.5, numReviews: 20, soldCount: 150, tags: ['antibiotic'] },
      { name: 'Ciproxin 500', genericName: 'Ciprofloxacin', description: 'Strong antibiotic for various bacterial infections.', price: 600, discountPrice: 550, category: catMap['Antibiotics'], manufacturer: 'Bayer', stock: 60, dosageForm: 'Tablet', strength: '500mg', packSize: 'Pack of 10', requiresPrescription: true, averageRating: 4.8, numReviews: 15, soldCount: 110, tags: ['antibiotic'] },
      { name: 'Novidat 250', genericName: 'Ciprofloxacin', description: 'Antibiotic for respiratory and urinary tract infections.', price: 250, discountPrice: 0, category: catMap['Antibiotics'], manufacturer: 'Sami', stock: 90, dosageForm: 'Tablet', strength: '250mg', packSize: 'Pack of 10', requiresPrescription: true, averageRating: 4.2, numReviews: 12, soldCount: 75, tags: ['antibiotic'] },
      { name: 'Leflox 500', genericName: 'Levofloxacin', description: 'Effective antibiotic for severe infections.', price: 400, discountPrice: 360, category: catMap['Antibiotics'], manufacturer: 'Getz', stock: 75, dosageForm: 'Tablet', strength: '500mg', packSize: 'Pack of 10', requiresPrescription: true, averageRating: 4.3, numReviews: 8, soldCount: 50, tags: ['antibiotic'] },

      // Vitamins & Supplements
      { name: 'Centrum Silver', genericName: 'Multivitamin', description: 'Complete multivitamin for adults 50+.', price: 2500, discountPrice: 2200, category: catMap['Vitamins & Supplements'], manufacturer: 'Pfizer', stock: 60, dosageForm: 'Tablet', strength: 'N/A', packSize: 'Bottle of 100', isFeatured: true, isBestSeller: true, averageRating: 4.8, numReviews: 45, soldCount: 300, tags: ['vitamin', 'supplement'] },
      { name: 'Vitamin C 1000mg', genericName: 'Ascorbic Acid', description: 'High-potency vitamin C for immune support.', price: 800, discountPrice: 700, category: catMap['Vitamins & Supplements'], manufacturer: 'Nutrifactor', stock: 100, dosageForm: 'Tablet', strength: '1000mg', packSize: 'Bottle of 60', isFeatured: true, isBestSeller: true, averageRating: 4.7, numReviews: 55, soldCount: 350, tags: ['vitamin c', 'immunity'] },
      { name: 'Surbex Z', genericName: 'Multivitamin + Zinc', description: 'Vitamins B-Complex and Vitamin C with Zinc.', price: 450, discountPrice: 400, category: catMap['Vitamins & Supplements'], manufacturer: 'Abbott', stock: 200, dosageForm: 'Tablet', strength: 'N/A', packSize: 'Pack of 30', isBestSeller: true, averageRating: 4.9, numReviews: 60, soldCount: 400, tags: ['vitamin', 'zinc'] },
      { name: 'Calcium-D', genericName: 'Calcium + Vitamin D3', description: 'Bone strength supplement.', price: 350, discountPrice: 0, category: catMap['Vitamins & Supplements'], manufacturer: 'Glaxo', stock: 150, dosageForm: 'Tablet', strength: '600mg', packSize: 'Pack of 30', averageRating: 4.4, numReviews: 22, soldCount: 130, tags: ['calcium', 'vitamin'] },
      { name: 'Polybion Z', genericName: 'B-Complex', description: 'Vitamin B-Complex supplement.', price: 150, discountPrice: 0, category: catMap['Vitamins & Supplements'], manufacturer: 'Merck', stock: 180, dosageForm: 'Capsule', strength: 'N/A', packSize: 'Pack of 20', averageRating: 4.5, numReviews: 18, soldCount: 160, tags: ['vitamin'] },

      // Skin Care
      { name: 'Dermasone Cream', genericName: 'Betamethasone', description: 'Topical corticosteroid cream for eczema and dermatitis.', price: 350, discountPrice: 0, category: catMap['Skin Care'], manufacturer: 'Sanofi', stock: 100, dosageForm: 'Cream', strength: '0.05%', packSize: '15g Tube', requiresPrescription: true, averageRating: 4.1, numReviews: 12, soldCount: 55, tags: ['skin', 'cream'] },
      { name: 'Betnovate-N', genericName: 'Betamethasone + Neomycin', description: 'Skin cream for infected eczema and psoriasis.', price: 120, discountPrice: 0, category: catMap['Skin Care'], manufacturer: 'GSK', stock: 150, dosageForm: 'Cream', strength: 'N/A', packSize: '15g Tube', requiresPrescription: true, averageRating: 4.4, numReviews: 25, soldCount: 140, tags: ['skin', 'eczema'] },
      { name: 'Fucidin Ointment', genericName: 'Fusidic Acid', description: 'Antibiotic ointment for skin infections.', price: 250, discountPrice: 0, category: catMap['Skin Care'], manufacturer: 'Leo', stock: 80, dosageForm: 'Ointment', strength: '2%', packSize: '15g Tube', averageRating: 4.6, numReviews: 18, soldCount: 90, tags: ['skin', 'infection'] },
      { name: 'Hydrozole Cream', genericName: 'Hydrocortisone + Clotrimazole', description: 'Anti-fungal and anti-inflammatory cream.', price: 300, discountPrice: 280, category: catMap['Skin Care'], manufacturer: 'Stiefel', stock: 60, dosageForm: 'Cream', strength: '1%', packSize: '15g Tube', averageRating: 4.3, numReviews: 10, soldCount: 45, tags: ['skin', 'fungal'] },
      { name: 'Acnecid Wash', genericName: 'Salicylic Acid', description: 'Face wash for acne-prone skin.', price: 450, discountPrice: 400, category: catMap['Skin Care'], manufacturer: 'Derma', stock: 120, dosageForm: 'Liquid', strength: '2%', packSize: '100ml', averageRating: 4.5, numReviews: 35, soldCount: 200, tags: ['skin', 'acne'] },

      // Cough & Cold
      { name: 'Corex-D Syrup', genericName: 'Dextromethorphan + CPM', description: 'Cough suppressant syrup for dry cough and cold symptoms.', price: 180, discountPrice: 150, category: catMap['Cough & Cold'], manufacturer: 'Pfizer', stock: 120, dosageForm: 'Syrup', strength: '100ml', packSize: 'Bottle', isBestSeller: true, averageRating: 4.0, numReviews: 28, soldCount: 180, tags: ['cough', 'cold'] },
      { name: 'Hydryllin Syrup', genericName: 'Aminophylline', description: 'Cough syrup for wet and dry cough.', price: 150, discountPrice: 0, category: catMap['Cough & Cold'], manufacturer: 'Searle', stock: 150, dosageForm: 'Syrup', strength: '120ml', packSize: 'Bottle', averageRating: 4.6, numReviews: 40, soldCount: 250, tags: ['cough'] },
      { name: 'Arinac', genericName: 'Ibuprofen + Pseudoephedrine', description: 'Tablets for sinus congestion and cold.', price: 120, discountPrice: 0, category: catMap['Cough & Cold'], manufacturer: 'Abbott', stock: 200, dosageForm: 'Tablet', strength: '200mg', packSize: 'Pack of 10', averageRating: 4.7, numReviews: 30, soldCount: 190, tags: ['cold', 'sinus'] },
      { name: 'Panadol CF', genericName: 'Paracetamol + CPM', description: 'Cold and flu symptom relief.', price: 160, discountPrice: 0, category: catMap['Cough & Cold'], manufacturer: 'GSK', stock: 180, dosageForm: 'Tablet', strength: '500mg', packSize: 'Pack of 10', averageRating: 4.5, numReviews: 25, soldCount: 150, tags: ['cold', 'flu'] },
      { name: 'Pulmonol Syrup', genericName: 'Herbal Extract', description: 'Herbal syrup for soothing throat and cough.', price: 200, discountPrice: 180, category: catMap['Cough & Cold'], manufacturer: 'Hamdard', stock: 100, dosageForm: 'Syrup', strength: '120ml', packSize: 'Bottle', averageRating: 4.2, numReviews: 15, soldCount: 80, tags: ['cough', 'herbal'] },

      // Diabetes Care
      { name: 'Glucophage 500', genericName: 'Metformin', description: 'Type 2 diabetes management medication.', price: 300, discountPrice: 260, category: catMap['Diabetes Care'], manufacturer: 'Merck', stock: 200, dosageForm: 'Tablet', strength: '500mg', packSize: 'Pack of 30', requiresPrescription: true, isFeatured: true, averageRating: 4.6, numReviews: 50, soldCount: 400, tags: ['diabetes'] },
      { name: 'Amaryl 2mg', genericName: 'Glimepiride', description: 'Oral blood-glucose-lowering drug.', price: 400, discountPrice: 0, category: catMap['Diabetes Care'], manufacturer: 'Sanofi', stock: 150, dosageForm: 'Tablet', strength: '2mg', packSize: 'Pack of 30', requiresPrescription: true, averageRating: 4.7, numReviews: 30, soldCount: 200, tags: ['diabetes'] },
      { name: 'Getryl 2mg', genericName: 'Glimepiride', description: 'Effective control for type 2 diabetes.', price: 350, discountPrice: 320, category: catMap['Diabetes Care'], manufacturer: 'Getz', stock: 120, dosageForm: 'Tablet', strength: '2mg', packSize: 'Pack of 30', requiresPrescription: true, averageRating: 4.5, numReviews: 20, soldCount: 150, tags: ['diabetes'] },
      { name: 'Janumet 50/500', genericName: 'Sitagliptin + Metformin', description: 'Combination medicine for diabetes management.', price: 1200, discountPrice: 1100, category: catMap['Diabetes Care'], manufacturer: 'MSD', stock: 80, dosageForm: 'Tablet', strength: '50/500mg', packSize: 'Pack of 14', requiresPrescription: true, averageRating: 4.8, numReviews: 40, soldCount: 180, tags: ['diabetes'] },
      { name: 'Mixtard 30 FlexPen', genericName: 'Insulin Human', description: 'Pre-filled insulin pen.', price: 950, discountPrice: 900, category: catMap['Diabetes Care'], manufacturer: 'Novo Nordisk', stock: 50, dosageForm: 'Injection', strength: '100IU/ml', packSize: '3ml Pen', requiresPrescription: true, averageRating: 4.9, numReviews: 60, soldCount: 300, tags: ['diabetes', 'insulin'] },

      // Heart Health
      { name: 'Concor 5mg', genericName: 'Bisoprolol', description: 'Beta-blocker for hypertension and heart failure.', price: 450, discountPrice: 0, category: catMap['Heart Health'], manufacturer: 'Merck', stock: 90, dosageForm: 'Tablet', strength: '5mg', packSize: 'Pack of 14', requiresPrescription: true, averageRating: 4.4, numReviews: 15, soldCount: 75, tags: ['heart'] },
      { name: 'Lipget 10mg', genericName: 'Atorvastatin', description: 'Cholesterol-lowering medication.', price: 300, discountPrice: 270, category: catMap['Heart Health'], manufacturer: 'Getz', stock: 150, dosageForm: 'Tablet', strength: '10mg', packSize: 'Pack of 10', requiresPrescription: true, averageRating: 4.6, numReviews: 25, soldCount: 130, tags: ['cholesterol', 'heart'] },
      { name: 'Loprin 75mg', genericName: 'Aspirin', description: 'Low dose aspirin for heart protection.', price: 100, discountPrice: 0, category: catMap['Heart Health'], manufacturer: 'Highnoon', stock: 250, dosageForm: 'Tablet', strength: '75mg', packSize: 'Pack of 30', averageRating: 4.8, numReviews: 50, soldCount: 400, tags: ['heart', 'blood thinner'] },
      { name: 'Norvasc 5mg', genericName: 'Amlodipine', description: 'Calcium channel blocker for high blood pressure.', price: 400, discountPrice: 0, category: catMap['Heart Health'], manufacturer: 'Pfizer', stock: 120, dosageForm: 'Tablet', strength: '5mg', packSize: 'Pack of 20', requiresPrescription: true, averageRating: 4.5, numReviews: 20, soldCount: 110, tags: ['heart', 'bp'] },
      { name: 'Zestril 10mg', genericName: 'Lisinopril', description: 'ACE inhibitor for hypertension.', price: 350, discountPrice: 0, category: catMap['Heart Health'], manufacturer: 'AstraZeneca', stock: 100, dosageForm: 'Tablet', strength: '10mg', packSize: 'Pack of 14', requiresPrescription: true, averageRating: 4.4, numReviews: 18, soldCount: 90, tags: ['heart', 'bp'] },

      // Digestive Health
      { name: 'Omeprazole 20mg', genericName: 'Omeprazole', description: 'Proton pump inhibitor for acid reflux and GERD.', price: 250, discountPrice: 200, category: catMap['Digestive Health'], manufacturer: 'Getz', stock: 180, dosageForm: 'Capsule', strength: '20mg', packSize: 'Pack of 14', isBestSeller: true, averageRating: 4.3, numReviews: 35, soldCount: 220, tags: ['stomach', 'acid'] },
      { name: 'Risek 40mg', genericName: 'Omeprazole', description: 'For severe acid reflux and ulcers.', price: 350, discountPrice: 320, category: catMap['Digestive Health'], manufacturer: 'Getz', stock: 140, dosageForm: 'Capsule', strength: '40mg', packSize: 'Pack of 14', requiresPrescription: true, averageRating: 4.7, numReviews: 45, soldCount: 300, tags: ['stomach', 'acid'] },
      { name: 'Gaviscon Syrup', genericName: 'Sodium Alginate', description: 'Fast relief from heartburn and indigestion.', price: 200, discountPrice: 0, category: catMap['Digestive Health'], manufacturer: 'Reckitt', stock: 200, dosageForm: 'Syrup', strength: '120ml', packSize: 'Bottle', averageRating: 4.6, numReviews: 55, soldCount: 350, tags: ['stomach', 'heartburn'] },
      { name: 'Motilium 10mg', genericName: 'Domperidone', description: 'For nausea and vomiting.', price: 150, discountPrice: 0, category: catMap['Digestive Health'], manufacturer: 'J&J', stock: 120, dosageForm: 'Tablet', strength: '10mg', packSize: 'Pack of 50', requiresPrescription: true, averageRating: 4.4, numReviews: 25, soldCount: 160, tags: ['stomach', 'nausea'] },
      { name: 'Flagyl 400mg', genericName: 'Metronidazole', description: 'Antibiotic for stomach and intestinal infections.', price: 120, discountPrice: 0, category: catMap['Digestive Health'], manufacturer: 'Sanofi', stock: 250, dosageForm: 'Tablet', strength: '400mg', packSize: 'Pack of 20', requiresPrescription: true, averageRating: 4.8, numReviews: 60, soldCount: 500, tags: ['stomach', 'infection'] },

      // Eye & Ear Care
      { name: 'Refresh Tears', genericName: 'Carboxymethylcellulose', description: 'Lubricant eye drops for dry eyes relief.', price: 450, discountPrice: 400, category: catMap['Eye & Ear Care'], manufacturer: 'Allergan', stock: 70, dosageForm: 'Drops', strength: '0.5%', packSize: '15ml', averageRating: 4.5, numReviews: 20, soldCount: 95, tags: ['eye', 'drops'] },
      { name: 'Systane Ultra', genericName: 'Polyethylene Glycol', description: 'High performance dry eye relief.', price: 600, discountPrice: 550, category: catMap['Eye & Ear Care'], manufacturer: 'Alcon', stock: 50, dosageForm: 'Drops', strength: '10ml', packSize: 'Bottle', averageRating: 4.7, numReviews: 30, soldCount: 120, tags: ['eye', 'drops'] },
      { name: 'Betnesol-N Drops', genericName: 'Betamethasone + Neomycin', description: 'Eye, ear, and nose drops for inflammation and infection.', price: 80, discountPrice: 0, category: catMap['Eye & Ear Care'], manufacturer: 'GSK', stock: 150, dosageForm: 'Drops', strength: '5ml', packSize: 'Bottle', requiresPrescription: true, averageRating: 4.3, numReviews: 40, soldCount: 200, tags: ['eye', 'ear', 'drops'] },
      { name: 'Genticyn Drops', genericName: 'Gentamicin', description: 'Antibiotic eye/ear drops.', price: 60, discountPrice: 0, category: catMap['Eye & Ear Care'], manufacturer: 'Abbott', stock: 200, dosageForm: 'Drops', strength: '10ml', packSize: 'Bottle', requiresPrescription: true, averageRating: 4.5, numReviews: 22, soldCount: 140, tags: ['eye', 'ear', 'antibiotic'] },
      { name: 'Tobradex Drops', genericName: 'Tobramycin + Dexamethasone', description: 'Antibiotic and steroid eye drops.', price: 350, discountPrice: 0, category: catMap['Eye & Ear Care'], manufacturer: 'Novartis', stock: 80, dosageForm: 'Drops', strength: '5ml', packSize: 'Bottle', requiresPrescription: true, averageRating: 4.6, numReviews: 18, soldCount: 90, tags: ['eye', 'drops', 'steroid'] },

      // First Aid
      { name: 'Band-Aid Flexible', genericName: 'Adhesive Bandage', description: 'Flexible fabric bandages for minor cuts and wounds.', price: 350, discountPrice: 300, category: catMap['First Aid'], manufacturer: 'J&J', stock: 150, dosageForm: 'Other', strength: 'N/A', packSize: 'Box of 30', isBestSeller: true, averageRating: 4.6, numReviews: 40, soldCount: 280, tags: ['bandage', 'first aid'] },
      { name: 'Pyodine Solution', genericName: 'Povidone Iodine', description: 'Antiseptic solution for wound cleaning.', price: 150, discountPrice: 0, category: catMap['First Aid'], manufacturer: 'Brookes', stock: 200, dosageForm: 'Liquid', strength: '10%', packSize: '100ml', averageRating: 4.8, numReviews: 60, soldCount: 350, tags: ['antiseptic', 'wound'] },
      { name: 'Dettol Antiseptic Liquid', genericName: 'Chloroxylenol', description: 'First aid antiseptic liquid.', price: 400, discountPrice: 380, category: catMap['First Aid'], manufacturer: 'Reckitt', stock: 180, dosageForm: 'Liquid', strength: '250ml', packSize: 'Bottle', averageRating: 4.9, numReviews: 100, soldCount: 600, tags: ['antiseptic', 'first aid'] },
      { name: 'Polyfax Skin Ointment', genericName: 'Polymyxin B + Bacitracin', description: 'Antibiotic ointment for cuts and burns.', price: 100, discountPrice: 0, category: catMap['First Aid'], manufacturer: 'GSK', stock: 250, dosageForm: 'Ointment', strength: '20g', packSize: 'Tube', averageRating: 4.7, numReviews: 80, soldCount: 450, tags: ['ointment', 'burns'] },
      { name: 'Crepe Bandage', genericName: 'Cotton Bandage', description: 'Elastic crepe bandage for sprains and strains.', price: 200, discountPrice: 0, category: catMap['First Aid'], manufacturer: 'Local', stock: 300, dosageForm: 'Other', strength: '7.5cm', packSize: '1 Roll', averageRating: 4.4, numReviews: 25, soldCount: 150, tags: ['bandage', 'sprain'] },
    ];

    await Medicine.insertMany(
      medicines.map((m) => ({
        ...m,
        image: img(m.name),
        isActive: true,
      }))
    );
    console.log('✅ Healora seed data inserted successfully!');
    console.log('👤 Admin: admin@healora.com / admin123');
    console.log('👤 User: john@healora.com / user123');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
