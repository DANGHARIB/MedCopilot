import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Paper, TextField, InputAdornment, Box, Chip, Button, Typography, 
  Card, CardContent, Grid, MenuItem, Select, FormControl, InputLabel, 
  CircularProgress, Snackbar, Alert, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { getSchools, deleteSchool } from '../../../services/mockAdmin/schools';
import './SchoolsList.css';

/**
 * Composant affichant la liste des écoles médicales
 * Avec options de recherche, filtrage, tri et pagination
 */
const SchoolsList = () => {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all'
  });
  const navigate = useNavigate();

  // Fonction pour charger les données des écoles
  const fetchSchools = async () => {
    setLoading(true);
    try {
      const result = await getSchools({
        page: pagination.page + 1,
        pageSize: pagination.pageSize,
        search: filters.search,
        status: filters.status !== 'all' ? filters.status : undefined,
        type: filters.type !== 'all' ? filters.type : undefined
      });
      
      setSchools(result.schools);
      setFilteredSchools(result.schools);
      setPagination({
        ...pagination,
        total: result.total
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des écoles',
        severity: 'error'
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial des données
  useEffect(() => {
    fetchSchools();
  }, [pagination.page, pagination.pageSize, filters]);

  useEffect(() => {
    // Filtrer les écoles en fonction du terme de recherche
    const filtered = schools.filter(school => 
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchools(filtered);
  }, [searchTerm, schools]);

  // Gestion du changement de page
  const handlePageChange = (event, newPage) => {
    setPagination({
      ...pagination,
      page: newPage
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination({
      ...pagination,
      page: 0,
      pageSize: parseInt(event.target.value, 10)
    });
  };

  // Gestion de la suppression d'une école
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette école?')) {
      await deleteSchool(id);
      setSchools(schools.filter(school => school.id !== id));
      setFilteredSchools(filteredSchools.filter(school => school.id !== id));
      setSnackbar({
        open: true,
        message: 'École supprimée avec succès',
        severity: 'success'
      });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleView = (id) => {
    navigate(`/admin/schools/details/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/schools/edit/${id}`);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const getStatusChip = (status) => {
    const statusProps = {
      'active': { color: 'success', label: 'Actif' },
      'inactive': { color: 'error', label: 'Inactif' },
      'pending': { color: 'warning', label: 'En attente' }
    };
    
    const { color, label } = statusProps[status] || { color: 'default', label: status };
    
    return (
      <Chip 
        label={label}
        color={color}
        size="small"
      />
    );
  };

  return (
    <Card className="schools-list-container">
      <CardContent>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between" className="schools-list-header">
          <Grid item>
            <Typography variant="h5">Écoles de médecine</Typography>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => navigate('/admin/schools/create')}
            >
              Ajouter une école
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} className="schools-filter-row" sx={{ mt: 2, mb: 2 }}>
          <Grid item xs={12} sm={12} md={4}>
            <TextField
              placeholder="Rechercher une école..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Type d'école</InputLabel>
              <Select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                label="Type d'école"
              >
                <MenuItem value="all">Tous les types</MenuItem>
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Privé</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Statut</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                label="Statut"
              >
                <MenuItem value="all">Tous les statuts</MenuItem>
                <MenuItem value="active">Actif</MenuItem>
                <MenuItem value="inactive">Inactif</MenuItem>
                <MenuItem value="pending">En attente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Localisation</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSchools.map((school) => (
                    <TableRow key={school.id} hover>
                      <TableCell>{school.name}</TableCell>
                      <TableCell>{school.location}</TableCell>
                      <TableCell>
                        <Chip 
                          label={school.type === 'public' ? 'Public' : 'Privé'}
                          color={school.type === 'public' ? 'primary' : 'secondary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{getStatusChip(school.status)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton 
                            color="default" 
                            size="small" 
                            onClick={() => handleView(school.id)}
                            title="Voir les détails"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            color="primary" 
                            size="small" 
                            onClick={() => handleEdit(school.id)}
                            title="Modifier"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            size="small" 
                            onClick={() => handleDelete(school.id)}
                            title="Supprimer"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              component="div"
              count={pagination.total}
              page={pagination.page}
              onPageChange={handlePageChange}
              rowsPerPage={pagination.pageSize}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Écoles par page"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
            />
          </>
        )}
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

export default SchoolsList; 