import { v4 as uuidv4 } from 'uuid';

// Données d'exemple pour les écoles
const mockSchools = [
  {
    id: 'school-1',
    name: 'Faculté de Médecine Paris Descartes',
    type: 'public',
    status: 'active',
    location: {
      street: '15 Rue de l\'École de Médecine',
      city: 'Paris',
      postalCode: '75006',
      country: 'France'
    },
    website: 'https://medecine.u-paris.fr/',
    contactEmail: 'contact@med-paris.fr',
    contactPhone: '+33145625489',
    description: 'Une des plus anciennes facultés de médecine de France, offrant une formation médicale complète et de qualité.',
    programsOffered: ['Médecine générale', 'Spécialités médicales', 'Recherche'],
    studentsCount: 3200,
    facultyCount: 450,
    createdAt: '2021-09-01T08:00:00Z',
    updatedAt: '2023-03-15T10:30:00Z'
  },
  {
    id: 'school-2',
    name: 'Harvard Medical School',
    type: 'private',
    status: 'active',
    location: {
      street: '25 Shattuck Street',
      city: 'Boston',
      postalCode: '02115',
      country: 'États-Unis'
    },
    website: 'https://hms.harvard.edu/',
    contactEmail: 'admissions@hms.harvard.edu',
    contactPhone: '+16174324422',
    description: 'L\'une des écoles de médecine les plus prestigieuses au monde, Harvard Medical School est à la pointe de l\'éducation médicale, de la recherche et de l\'innovation clinique.',
    programsOffered: ['MD Program', 'MD-PhD Program', 'Graduate Education'],
    studentsCount: 1750,
    facultyCount: 12000,
    createdAt: '2020-08-15T08:00:00Z',
    updatedAt: '2023-04-20T14:45:00Z'
  },
  {
    id: 'school-3',
    name: 'Faculté de Médecine de Montpellier',
    type: 'public',
    status: 'active',
    location: {
      street: '2 Rue École de Médecine',
      city: 'Montpellier',
      postalCode: '34090',
      country: 'France'
    },
    website: 'https://medecine.edu.umontpellier.fr/',
    contactEmail: 'contact@med-montpellier.fr',
    contactPhone: '+33467608111',
    description: 'La plus ancienne faculté de médecine en activité au monde, fondée en 1220.',
    programsOffered: ['DFGSM', 'DFASM', 'DES'],
    studentsCount: 2800,
    facultyCount: 380,
    createdAt: '2021-07-20T09:15:00Z',
    updatedAt: '2023-02-10T11:20:00Z'
  },
  {
    id: 'school-4',
    name: 'Johns Hopkins School of Medicine',
    type: 'private',
    status: 'active',
    location: {
      street: '733 N Broadway',
      city: 'Baltimore',
      postalCode: '21205',
      country: 'États-Unis'
    },
    website: 'https://www.hopkinsmedicine.org/som/',
    contactEmail: 'admissions@jhmi.edu',
    contactPhone: '+14109554766',
    description: 'École de médecine pionnière reconnue pour son excellence en recherche médicale et en soins cliniques.',
    programsOffered: ['MD Program', 'Graduate Programs', 'Allied Health'],
    studentsCount: 1500,
    facultyCount: 2300,
    createdAt: '2020-09-05T10:30:00Z',
    updatedAt: '2023-05-12T09:45:00Z'
  },
  {
    id: 'school-5',
    name: 'Université de Médecine de Genève',
    type: 'public',
    status: 'active',
    location: {
      street: 'Rue Michel-Servet 1',
      city: 'Genève',
      postalCode: '1211',
      country: 'Suisse'
    },
    website: 'https://www.unige.ch/medecine/',
    contactEmail: 'secretariat@medecine.unige.ch',
    contactPhone: '+41223795002',
    description: 'Une institution de renommée internationale pour l\'enseignement et la recherche en médecine.',
    programsOffered: ['Bachelor en Médecine', 'Master en Médecine', 'Doctorat'],
    studentsCount: 1900,
    facultyCount: 300,
    createdAt: '2021-01-15T08:00:00Z',
    updatedAt: '2023-01-05T15:30:00Z'
  },
  {
    id: 'school-6',
    name: 'Tokyo Medical and Dental University',
    type: 'public',
    status: 'active',
    location: {
      street: '1-5-45 Yushima',
      city: 'Tokyo',
      postalCode: '113-8510',
      country: 'Japon'
    },
    website: 'http://www.tmd.ac.jp/english/',
    contactEmail: 'international@ml.tmd.ac.jp',
    contactPhone: '+81358035550',
    description: 'Une des principales universités médicales du Japon, spécialisée dans les soins dentaires et médicaux.',
    programsOffered: ['Medicine', 'Dentistry', 'Biomedical Sciences'],
    studentsCount: 2900,
    facultyCount: 410,
    createdAt: '2021-04-10T07:00:00Z',
    updatedAt: '2023-06-01T08:15:00Z'
  },
  {
    id: 'school-7',
    name: 'Nouvelle École de Médecine',
    type: 'private',
    status: 'draft',
    location: {
      street: '10 Avenue de la Recherche',
      city: 'Lyon',
      postalCode: '69000',
      country: 'France'
    },
    website: 'https://www.nouvelle-ecole-med.fr',
    contactEmail: 'info@nouvelle-ecole-med.fr',
    contactPhone: '+33472123456',
    description: 'Nouvelle école de médecine innovante en cours de développement.',
    programsOffered: [],
    studentsCount: 0,
    facultyCount: 0,
    createdAt: '2023-07-01T14:00:00Z',
    updatedAt: '2023-07-01T14:00:00Z'
  }
];

// Fonction pour obtenir la liste des écoles avec filtrage et pagination
export const getSchools = async (params = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    status = '',
    type = ''
  } = params;

  // Délai simulé pour imiter une API réelle
  await new Promise(resolve => setTimeout(resolve, 300));

  let filteredSchools = [...mockSchools];

  // Filtrage par terme de recherche
  if (search) {
    const searchLower = search.toLowerCase();
    filteredSchools = filteredSchools.filter(school => 
      school.name.toLowerCase().includes(searchLower) || 
      school.location.city.toLowerCase().includes(searchLower) || 
      school.location.country.toLowerCase().includes(searchLower)
    );
  }

  // Filtrage par statut
  if (status) {
    filteredSchools = filteredSchools.filter(school => school.status === status);
  }

  // Filtrage par type
  if (type) {
    filteredSchools = filteredSchools.filter(school => school.type === type);
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedSchools = filteredSchools.slice(startIndex, endIndex);

  return {
    schools: paginatedSchools,
    totalCount: filteredSchools.length,
    page,
    limit
  };
};

// Fonction pour obtenir une école par son ID
export const getSchoolById = async (id) => {
  // Délai simulé
  await new Promise(resolve => setTimeout(resolve, 200));

  const school = mockSchools.find(school => school.id === id);
  
  if (!school) {
    throw new Error('École non trouvée');
  }
  
  return school;
};

// Fonction pour créer une nouvelle école
export const createSchool = async (schoolData) => {
  // Délai simulé
  await new Promise(resolve => setTimeout(resolve, 500));

  const newSchool = {
    id: `school-${uuidv4()}`,
    ...schoolData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockSchools.push(newSchool);
  
  return newSchool;
};

// Fonction pour mettre à jour une école existante
export const updateSchool = async (id, schoolData) => {
  // Délai simulé
  await new Promise(resolve => setTimeout(resolve, 400));

  const schoolIndex = mockSchools.findIndex(school => school.id === id);
  
  if (schoolIndex === -1) {
    throw new Error('École non trouvée');
  }
  
  const updatedSchool = {
    ...mockSchools[schoolIndex],
    ...schoolData,
    updatedAt: new Date().toISOString()
  };
  
  mockSchools[schoolIndex] = updatedSchool;
  
  return updatedSchool;
};

// Fonction pour supprimer une école
export const deleteSchool = async (id) => {
  // Délai simulé
  await new Promise(resolve => setTimeout(resolve, 300));

  const schoolIndex = mockSchools.findIndex(school => school.id === id);
  
  if (schoolIndex === -1) {
    throw new Error('École non trouvée');
  }
  
  mockSchools.splice(schoolIndex, 1);
  
  return { success: true, message: 'École supprimée avec succès' };
};

// Fonction utilitaire qui combine createSchool et updateSchool
export const saveSchool = async (schoolData) => {
  if (schoolData.id) {
    // Mise à jour d'une école existante
    return await updateSchool(schoolData.id, schoolData);
  } else {
    // Création d'une nouvelle école
    return await createSchool(schoolData);
  }
}; 