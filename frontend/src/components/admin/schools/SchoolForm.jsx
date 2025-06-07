import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { getSchoolById, saveSchool } from '../../../services/mockAdmin/schools';
import './SchoolForm.css';

/**
 * Composant de formulaire pour ajouter ou modifier une école médicale
 */
const SchoolForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'public',
    status: 'active',
    foundedYear: '',
    description: '',
    studentsCount: '',
    facultiesCount: '',
    location: {
      address: '',
      city: '',
      country: '',
      postalCode: ''
    },
    contactInfo: {
      email: '',
      phone: '',
      website: ''
    },
    programs: [],
    partnerships: [],
    stats: {
      successRate: '',
      employmentRate: '',
      satisfactionRate: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const isEditMode = !!id;

  // Chargement des données de l'école si mode édition
  useEffect(() => {
    if (isEditMode) {
      const fetchSchoolData = async () => {
        setInitialLoading(true);
        try {
          const schoolData = await getSchoolById(id);
          setFormData({
            name: schoolData.name || '',
            type: schoolData.type || 'public',
            status: schoolData.status || 'active',
            foundedYear: schoolData.foundedYear || '',
            description: schoolData.description || '',
            studentsCount: schoolData.studentsCount || '',
            facultiesCount: schoolData.facultiesCount || '',
            location: {
              address: schoolData.location?.address || '',
              city: schoolData.location?.city || '',
              country: schoolData.location?.country || '',
              postalCode: schoolData.location?.postalCode || '',
            },
            contactInfo: {
              email: schoolData.contactInfo?.email || '',
              phone: schoolData.contactInfo?.phone || '',
              website: schoolData.contactInfo?.website || '',
            },
            programs: schoolData.programs || [],
            partnerships: schoolData.partnerships || [],
            stats: {
              successRate: schoolData.stats?.successRate || '',
              employmentRate: schoolData.stats?.employmentRate || '',
              satisfactionRate: schoolData.stats?.satisfactionRate || '',
            }
          });
        } catch (error) {
          setSnackbar({
            open: true,
            message: 'Erreur lors du chargement des données de l\'école',
            severity: 'error'
          });
          console.error(error);
        } finally {
          setInitialLoading(false);
        }
      };
      fetchSchoolData();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleAddProgram = () => {
    setFormData(prev => ({
      ...prev,
      programs: [...prev.programs, { name: '', duration: '', level: '', studentsCount: '' }]
    }));
  };

  const handleRemoveProgram = (index) => {
    setFormData(prev => ({
      ...prev,
      programs: prev.programs.filter((_, i) => i !== index)
    }));
  };

  const handleProgramChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      programs: prev.programs.map((program, i) => 
        i === index ? { ...program, [field]: value } : program
      )
    }));
  };

  const handleAddPartnership = () => {
    setFormData(prev => ({
      ...prev,
      partnerships: [...prev.partnerships, { partnerName: '', type: '', country: '', startDate: '', status: 'active' }]
    }));
  };

  const handleRemovePartnership = (index) => {
    setFormData(prev => ({
      ...prev,
      partnerships: prev.partnerships.filter((_, i) => i !== index)
    }));
  };

  const handlePartnershipChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      partnerships: prev.partnerships.map((partnership, i) => 
        i === index ? { ...partnership, [field]: value } : partnership
      )
    }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Si mode édition, on ajoute l'ID dans les valeurs
      const schoolData = isEditMode ? { ...formData, id } : formData;
      
      await saveSchool(schoolData);
      setSnackbar({
        open: true,
        message: `École ${isEditMode ? 'modifiée' : 'créée'} avec succès`,
        severity: 'success'
      });
      navigate('/admin/schools');
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Erreur lors de l'${isEditMode ? 'édition' : 'ajout'} de l'école`,
        severity: 'error'
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  if (initialLoading) {
    return (
      <Card className="school-form-container">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  return (
    <Card className="school-form-container">
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin/schools')}
            >
              Retour
            </Button>
            <Typography variant="h5">
              {isEditMode ? 'Modifier une école' : 'Ajouter une école'}
            </Typography>
          </Box>
        }
      />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Divider textAlign="left" sx={{ mb: 2, mt: 1 }}>
                <Typography variant="subtitle1">Informations générales</Typography>
              </Divider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                label="Nom de l'école"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Type"
                  required
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Privé</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Statut"
                  required
                >
                  <MenuItem value="active">Actif</MenuItem>
                  <MenuItem value="inactive">Inactif</MenuItem>
                  <MenuItem value="pending">En attente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                name="foundedYear"
                label="Année de fondation"
                type="number"
                value={formData.foundedYear}
                onChange={handleChange}
                fullWidth
                inputProps={{ min: 1000, max: new Date().getFullYear() }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                name="studentsCount"
                label="Nombre d'étudiants"
                type="number"
                value={formData.studentsCount}
                onChange={handleChange}
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                name="facultiesCount"
                label="Nombre de facultés"
                type="number"
                value={formData.facultiesCount}
                onChange={handleChange}
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider textAlign="left" sx={{ mb: 2, mt: 1 }}>
                <Typography variant="subtitle1">Localisation</Typography>
              </Divider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Adresse"
                value={formData.location.address}
                onChange={(e) => handleNestedChange('location', 'address', e.target.value)}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                label="Ville"
                value={formData.location.city}
                onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                label="Pays"
                value={formData.location.country}
                onChange={(e) => handleNestedChange('location', 'country', e.target.value)}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                label="Code postal"
                value={formData.location.postalCode}
                onChange={(e) => handleNestedChange('location', 'postalCode', e.target.value)}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider textAlign="left" sx={{ mb: 2, mt: 1 }}>
                <Typography variant="subtitle1">Informations de contact</Typography>
              </Divider>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Email"
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => handleNestedChange('contactInfo', 'email', e.target.value)}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Téléphone"
                value={formData.contactInfo.phone}
                onChange={(e) => handleNestedChange('contactInfo', 'phone', e.target.value)}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Site web"
                type="url"
                value={formData.contactInfo.website}
                onChange={(e) => handleNestedChange('contactInfo', 'website', e.target.value)}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider textAlign="left" sx={{ mb: 2, mt: 1 }}>
                <Typography variant="subtitle1">Programmes d'études</Typography>
              </Divider>
            </Grid>
            
            <Grid item xs={12}>
              {formData.programs.map((program, index) => (
                <Box key={index} mb={2} sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Nom du programme"
                        value={program.name}
                        onChange={(e) => handleProgramChange(index, 'name', e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Durée (années)"
                        type="number"
                        value={program.duration}
                        onChange={(e) => handleProgramChange(index, 'duration', e.target.value)}
                        fullWidth
                        required
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth required>
                        <InputLabel>Niveau d'études</InputLabel>
                        <Select
                          value={program.level}
                          onChange={(e) => handleProgramChange(index, 'level', e.target.value)}
                          label="Niveau d'études"
                        >
                          <MenuItem value="undergraduate">Premier cycle</MenuItem>
                          <MenuItem value="graduate">Deuxième cycle</MenuItem>
                          <MenuItem value="postgraduate">Troisième cycle</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Nombre d'étudiants"
                        type="number"
                        value={program.studentsCount}
                        onChange={(e) => handleProgramChange(index, 'studentsCount', e.target.value)}
                        fullWidth
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <IconButton 
                        color="error"
                        onClick={() => handleRemoveProgram(index)}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddProgram}
                fullWidth
                sx={{ mt: 1 }}
              >
                Ajouter un programme
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Divider textAlign="left" sx={{ mb: 2, mt: 1 }}>
                <Typography variant="subtitle1">Partenariats</Typography>
              </Divider>
            </Grid>
            
            <Grid item xs={12}>
              {formData.partnerships.map((partnership, index) => (
                <Box key={index} mb={2} sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Nom de l'institution partenaire"
                        value={partnership.partnerName}
                        onChange={(e) => handlePartnershipChange(index, 'partnerName', e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Type de partenariat"
                        value={partnership.type}
                        onChange={(e) => handlePartnershipChange(index, 'type', e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Pays"
                        value={partnership.country}
                        onChange={(e) => handlePartnershipChange(index, 'country', e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Date de début"
                        value={partnership.startDate}
                        onChange={(e) => handlePartnershipChange(index, 'startDate', e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <FormControl fullWidth>
                        <InputLabel>Statut</InputLabel>
                        <Select
                          value={partnership.status}
                          onChange={(e) => handlePartnershipChange(index, 'status', e.target.value)}
                          label="Statut"
                        >
                          <MenuItem value="active">Actif</MenuItem>
                          <MenuItem value="expired">Expiré</MenuItem>
                          <MenuItem value="negotiation">En négociation</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <IconButton
                        color="error"
                        onClick={() => handleRemovePartnership(index)}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddPartnership}
                fullWidth
                sx={{ mt: 1 }}
              >
                Ajouter un partenariat
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Divider textAlign="left" sx={{ mb: 2, mt: 1 }}>
                <Typography variant="subtitle1">Statistiques</Typography>
              </Divider>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Taux de réussite (%)"
                type="number"
                value={formData.stats.successRate}
                onChange={(e) => handleNestedChange('stats', 'successRate', e.target.value)}
                fullWidth
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Taux d'emploi après diplôme (%)"
                type="number"
                value={formData.stats.employmentRate}
                onChange={(e) => handleNestedChange('stats', 'employmentRate', e.target.value)}
                fullWidth
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Satisfaction étudiante (%)"
                type="number"
                value={formData.stats.satisfactionRate}
                onChange={(e) => handleNestedChange('stats', 'satisfactionRate', e.target.value)}
                fullWidth
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
          </Grid>
          
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/schools')}
              >
                Annuler
              </Button>
              <Button
                variant="contained"
                type="submit"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : isEditMode ? (
                  'Enregistrer les modifications'
                ) : (
                  'Créer l\'école'
                )}
              </Button>
            </Stack>
          </Box>
        </form>
      </CardContent>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default SchoolForm; 