import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Divider,
  Snackbar,
  Alert,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WarningIcon from '@mui/icons-material/Warning';
import { getSchoolById, deleteSchool } from '../../../services/mockAdmin/schools';
import './SchoolDetails.css';

/**
 * Composant affichant les détails d'une école médicale
 * Inclut les informations générales et les statistiques
 */
const SchoolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Récupération des détails de l'école
  useEffect(() => {
    const fetchSchoolDetails = async () => {
      setLoading(true);
      try {
        const result = await getSchoolById(id);
        setSchool(result);
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Erreur lors du chargement des détails de l\'école',
          severity: 'error'
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolDetails();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Suppression de l'école
  const handleDeleteConfirm = async () => {
    try {
      await deleteSchool(id);
      setSnackbar({
        open: true,
        message: 'École supprimée avec succès',
        severity: 'success'
      });
      navigate('/admin/schools');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression',
        severity: 'error'
      });
      console.error(error);
    }
    setDeleteDialog(false);
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // TabPanel component for rendering tab content
  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`school-tabpanel-${index}`}
        aria-labelledby={`school-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ pt: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  };

  const getChipForStatus = (status) => {
    const statusProps = {
      'active': { color: 'success', label: 'Actif' },
      'inactive': { color: 'error', label: 'Inactif' },
      'pending': { color: 'warning', label: 'En attente' },
      'expired': { color: 'error', label: 'Expiré' },
      'negotiation': { color: 'warning', label: 'En négociation' }
    };
    
    const { color, label } = statusProps[status] || { color: 'default', label: status };
    
    return <Chip color={color} label={label} size="small" />;
  };

  if (loading) {
    return (
      <Card className="school-details-container">
        <Box display="flex" justifyContent="center" alignItems="center" p={4}>
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  if (!school) {
    return (
      <Card className="school-details-container">
        <CardContent>
          <Box className="school-details-empty-message" textAlign="center" py={4}>
            <Typography color="error">L'école demandée n'existe pas ou a été supprimée.</Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/admin/schools')} 
              sx={{ mt: 2 }}
            >
              Retour à la liste
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="school-details-container">
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate('/admin/schools')}
              sx={{ mb: 2 }}
            >
              Retour à la liste
            </Button>
            
            <Box display="flex" justifyContent="space-between" alignItems="center" className="school-details-header">
              <Box>
                <Typography variant="h4" className="school-details-title">{school.name}</Typography>
                <Typography variant="body2" color="text.secondary" className="school-details-id">{`ID: ${school.id}`}</Typography>
              </Box>
              <Stack direction="row" spacing={1} className="school-details-actions">
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/admin/schools/edit/${id}`)}
                >
                  Modifier
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteDialogOpen}
                >
                  Supprimer
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} className="school-details-tab-content">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="school details tabs">
                <Tab label="Informations générales" id="school-tab-0" />
                <Tab label="Programmes d'études" id="school-tab-1" />
                <Tab label="Partenariats" id="school-tab-2" />
                <Tab label="Statistiques" id="school-tab-3" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">Nom</Typography>
                    <Typography variant="body1">{school.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                    <Chip 
                      color={school.type === 'public' ? 'primary' : 'secondary'}
                      label={school.type === 'public' ? 'Public' : 'Privé'}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">Statut</Typography>
                    {getChipForStatus(school.status)}
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">Ville</Typography>
                    <Typography variant="body1">{school.location?.city || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">Pays</Typography>
                    <Typography variant="body1">{school.location?.country || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">Adresse</Typography>
                    <Typography variant="body1">{school.location?.street || '-'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">Téléphone</Typography>
                    <Typography variant="body1">{school.contactPhone || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{school.contactEmail || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">Site web</Typography>
                    <Typography variant="body1">{school.website || '-'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">Année de fondation</Typography>
                    <Typography variant="body1">{school.foundedYear || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">Nombre d'étudiants</Typography>
                    <Typography variant="body1">{school.studentsCount || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">Nombre de facultés</Typography>
                    <Typography variant="body1">{school.facultyCount || '-'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>{school.description || '-'}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              {school.programsOffered?.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Programme</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {school.programsOffered.map((program, index) => (
                        <TableRow key={index}>
                          <TableCell>{program}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box textAlign="center" p={3}>
                  <Typography color="text.secondary">Aucun programme d'études enregistré</Typography>
                </Box>
              )}
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              {school.partnerships?.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Institution partenaire</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Pays</TableCell>
                        <TableCell>Date de début</TableCell>
                        <TableCell>Statut</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {school.partnerships.map((partnership, index) => (
                        <TableRow key={index}>
                          <TableCell>{partnership.partnerName}</TableCell>
                          <TableCell>{partnership.type}</TableCell>
                          <TableCell>{partnership.country || '-'}</TableCell>
                          <TableCell>{partnership.startDate || '-'}</TableCell>
                          <TableCell>{getChipForStatus(partnership.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box textAlign="center" p={3}>
                  <Typography color="text.secondary">Aucun partenariat enregistré</Typography>
                </Box>
              )}
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>Taux de réussite</Typography>
                    <Typography variant="h3" color="primary">
                      {school.stats?.successRate ? `${school.stats.successRate}%` : 'N/A'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>Taux d'emploi après diplôme</Typography>
                    <Typography variant="h3" color="primary">
                      {school.stats?.employmentRate ? `${school.stats.employmentRate}%` : 'N/A'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>Satisfaction étudiante</Typography>
                    <Typography variant="h3" color="primary">
                      {school.stats?.satisfactionRate ? `${school.stats.satisfactionRate}%` : 'N/A'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
          </Grid>
        </Grid>
      </CardContent>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialog}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <WarningIcon color="error" />
            Confirmer la suppression
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette école? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Oui, supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
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

export default SchoolDetails; 