import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import {
    Plus,  X as CloseIcon,
    List, CalendarDays
} from 'lucide-react';
import {
    Container, Box, Typography, Button, Link as MuiLink,
    Alert, Paper, Stack, Grid as MuiGrid,
    Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel,
    Select, MenuItem, Checkbox, FormControlLabel, IconButton, 
} from '@mui/material';

// Importations des composants existants
import UserLayout from '../components/user/layout/UserLayout';
import EventDetailModal from '../components/Timeline/EventDetailModal';
import EventList from '../components/Timeline/EventList';
import UpcomingEvents from '../components/Timeline/UpcomingEvents';
import CalendarView from '../components/Timeline/CalendarView';
import { TimelineBreadcrumbs } from '../components/UI/Breadcrumbs';

import './TimelineCalendarPage.css';

// --- Mock Hooks ---
const useAuth = () => {
    return { user: { id: 'mockUserId' } };
};
const useToast = () => {
    return {
        toast: ({ title, description, variant }) => {
            const severity = variant === 'destructive' ? 'error' : 'info';
            console.log(`[Toast - ${severity}] ${title}: ${description}`);
        }
    };
};

// --- Mock Data ---
const mockEvents = [
    { id: '1', title: 'AMCAS Application Opens', description: 'Begin filling out your application materials.', date: new Date('2025-05-01'), startTime: '', endTime: '', isOfficial: true, category: 'deadline', importance: 'critical' },
    { id: '2', title: 'First Day to Submit AMCAS Applications', description: 'Submit your primary application as early as possible.', date: new Date('2025-05-27'), startTime: '9:30 AM', endTime: '', isOfficial: true, category: 'deadline', importance: 'high' },
    { id: '3', title: 'Last Recommended Date to Take the MCAT', description: 'Taking the MCAT after this date may delay your application.', date: new Date('2025-05-23'), startTime: '', endTime: '', isOfficial: true, category: 'exam', importance: 'medium' },
    { id: '4', title: 'Recommendation Letters Due', description: 'Ensure all your recommenders have submitted their letters by this date.', date: new Date('2025-06-15'), startTime: '', endTime: '', isOfficial: false, category: 'personal', importance: 'high', location: 'AMCAS Portal' },
    { id: '5', title: 'Complete Secondary Applications', description: 'Aim to complete and submit all secondary applications within 2 weeks of receipt.', date: new Date('2025-07-15'), startTime: '', endTime: '', isOfficial: false, category: 'task', importance: 'high' }
];

const TimelineCalendarPage = () => {
    // --- États (State) ---
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);
    const [selectedEventForCalendar, setSelectedEventForCalendar] = useState(null);
    const [showAddToCalendarDialog, setShowAddToCalendarDialog] = useState(false);
    const [selectedCalendarId, setSelectedCalendarId] = useState('primary');
    const [availableCalendars, _setAvailableCalendars] = useState([
        { id: 'primary', summary: 'My Calendar' },
        { id: 'amcas_master', summary: 'AMCAS Master Calendar' }
    ]);
    const [addToMasterCalendarToo, setAddToMasterCalendarToo] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    // Nouvel état pour suivre la vue actuelle
    const [currentView, setCurrentView] = useState('list'); // 'list' ou 'calendar'
    
    const { toast } = useToast();
    const { user } = useAuth();

    // --- useEffect pour fetch data ---
    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const processedEvents = mockEvents.map(e => ({ ...e, date: new Date(e.date) }));
                setEvents(processedEvents);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to load timeline events. Please try again later.');
                toast({ title: "Error", description: "Could not load events.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // --- Filtrage et Calcul Stats ---
    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes("") ||
        event.description?.toLowerCase().includes("")
    );
    
    // --- Handlers ---
    const handleEventClick = (event) => {
        const dbEventFormat = { 
            id: event.id, 
            title: event.title, 
            description: event.description,
            date: event.date instanceof Date ? event.date.toISOString().split('T')[0] : event.date,
            start_time: event.startTime || null, 
            end_time: event.endTime || null, 
            location: event.location || null,
            is_official: event.isOfficial, 
            category: event.category, 
            importance: event.importance 
        };
        setSelectedEventForDetail(dbEventFormat);
        setShowEventModal(true);
    };
    
    const handleOpenAddToCalendar = (event) => {
        const calendarEventFormat = { 
            id: event.id, 
            title: event.title, 
            description: event.description,
            date: event.date instanceof Date ? event.date.toISOString().split('T')[0] : event.date,
            rawDate: event.date, 
            start_time: event.startTime || null, 
            end_time: event.endTime || null,
            location: event.location || null 
        };
        setSelectedEventForCalendar(calendarEventFormat);
        setShowAddToCalendarDialog(true);
        setSelectedCalendarId(availableCalendars[0]?.id || '');
        setAddToMasterCalendarToo(false);
    };
    
    const handleEventUpdate = (updatedEvent) => {
        const internalFormatEvent = { 
            ...updatedEvent, 
            date: new Date(updatedEvent.date + 'T00:00:00'),
            startTime: updatedEvent.start_time, 
            endTime: updatedEvent.end_time,
            isOfficial: updatedEvent.is_official 
        };
        setEvents(prevEvents => prevEvents.map(event => 
            event.id === internalFormatEvent.id ? internalFormatEvent : event
        ));
        setShowEventModal(false);
        toast({ title: "Event Updated", description: `'${internalFormatEvent.title}' has been updated.` });
    };
    
    const handleAddToCalendarSubmit = async () => {
        if (!selectedEventForCalendar) return;
        console.log(`Adding '${selectedEventForCalendar.title}' to calendar ID: ${selectedCalendarId}`);
        toast({ 
            title: "Added to Your Calendar", 
            description: `'${selectedEventForCalendar.title}' added to ${availableCalendars.find(c => c.id === selectedCalendarId)?.summary || 'your calendar'}.` 
        });
        
        if (addToMasterCalendarToo) {
            if (!user) {
                toast({ 
                    title: "Authentication Required", 
                    description: "Please sign in to add events to the master calendar.", 
                    variant: "destructive" 
                });
            } else {
                console.log(`Adding '${selectedEventForCalendar.title}' to AMCAS Master Calendar for user ${user.id}`);
                await new Promise(resolve => setTimeout(resolve, 500));
                toast({ 
                    title: "Added to Master Calendar", 
                    description: `'${selectedEventForCalendar.title}' has also been added to the AMCAS master calendar.` 
                });
            }
        }
        
        setShowAddToCalendarDialog(false);
        setSelectedEventForCalendar(null);
    };
    
    const handleCreateEvent = () => {
        toast({ title: "Create Event", description: "This feature is coming soon!" });
    };

    // Nouveau handler pour changer de vue
    const handleViewChange = (view) => {
        setCurrentView(view);
    };

    return (
        <UserLayout>
            <Box className="timeline-app">
                <Container maxWidth="lg" className="app-container">
                    {/* Navigation Breadcrumbs avec le nouveau composant */}
                    <TimelineBreadcrumbs isCalendarPage={true} />

                    {/* Header Section */}
                    <Paper className="timeline-calendar-header-card">
                        <Box className="timeline-calendar-header-content">
                            <Box className="timeline-calendar-header-text">
                                <Typography variant="h1" color="primary">Application Timeline</Typography>
                                <Typography variant="body1">
                                    Track important deadlines and events for your medical school application.
                                </Typography>
                            </Box>
                            <Button 
                                variant="contained" 
                                className="timeline-calendar-create-button"
                                startIcon={<Plus size={16} />}
                                onClick={handleCreateEvent}
                            >
                                Create Event
                            </Button>
                        </Box>
                    </Paper>

                    {/* Main Content */}
                    <Box className="main-content">
                        {isLoading ? (
                            <Box className="loading-state">
                                <div className="loading-spinner"></div>
                                <Typography>Loading events...</Typography>
                            </Box>
                        ) : error ? (
                            <Alert severity="error" className="error-message">
                                {error}
                            </Alert>
                        ) : (
                            <>
                                

                                {/* Upcoming Events Section - Always visible */}
                                <Paper className="events-card">
                                    <Typography variant="h2" color="primary">Upcoming Events</Typography>
                                    <UpcomingEvents 
                                        events={filteredEvents} 
                                        onEventClick={handleEventClick} 
                                        onAddToCalendarClick={handleOpenAddToCalendar} 
                                    />
                                </Paper>

                                {/* Conditional View Section */}
                                <Paper className="events-card">
                                    <Typography variant="h2">
                                        {currentView === 'list' ? 'All Events' : 'Calendar View'}
                                    </Typography>

                                    {/* View Toggle Buttons */}
                                <Box className="view-toggle-container">
                                    <div className="view-toggle-buttons">
                                        <button
                                            className={`view-toggle-button ${currentView === 'list' ? 'active' : ''}`}
                                            onClick={() => handleViewChange('list')}
                                        >
                                            <List size={16} />
                                            <span>List</span>
                                        </button>
                                        <button
                                            className={`view-toggle-button ${currentView === 'calendar' ? 'active' : ''}`}
                                            onClick={() => handleViewChange('calendar')}
                                        >
                                            <CalendarDays size={16} />
                                            <span>Calendar</span>
                                        </button>
                                    </div>
                                </Box>
                                    
                                    {currentView === 'list' ? (
                                        <EventList 
                                            events={filteredEvents} 
                                            onEventClick={handleEventClick} 
                                            onAddToCalendarClick={handleOpenAddToCalendar} 
                                        />
                                    ) : (
                                        <CalendarView 
                                            events={filteredEvents} 
                                            onEventClick={handleEventClick} 
                                            onAddToCalendarClick={handleOpenAddToCalendar} 
                                        />
                                    )}
                                </Paper>
                            </>
                        )}
                    </Box>
                </Container>
            </Box>

            {/* Event Detail Modal */}
            {selectedEventForDetail && (
                <EventDetailModal
                    event={selectedEventForDetail}
                    open={showEventModal}
                    onClose={() => { 
                        setShowEventModal(false); 
                        setSelectedEventForDetail(null); 
                    }}
                    onEventUpdate={handleEventUpdate}
                />
            )}

            {/* Add to Calendar Dialog */}
            <Dialog
                open={showAddToCalendarDialog}
                onClose={() => setShowAddToCalendarDialog(false)}
                aria-labelledby="add-to-calendar-dialog-title"
                className="calendar-dialog"
                PaperProps={{ className: 'dialog-paper' }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle className="dialog-title">
                    Add to Calendar
                    <IconButton 
                        aria-label="close" 
                        onClick={() => setShowAddToCalendarDialog(false)}
                        className="close-button"
                    >
                        <CloseIcon size={18} />
                    </IconButton>
                </DialogTitle>

                <DialogContent className="dialog-content">
                    {selectedEventForCalendar && (
                        <Stack spacing={3} className="calendar-form">
                            <FormControl fullWidth>
                                <InputLabel id="calendar-select-label">Select Calendar</InputLabel>
                                <Select
                                    labelId="calendar-select-label"
                                    value={selectedCalendarId}
                                    label="Select Calendar"
                                    onChange={(e) => setSelectedCalendarId(e.target.value)}
                                    className="calendar-select"
                                >
                                    {availableCalendars.map(calendar => (
                                        <MenuItem key={calendar.id} value={calendar.id}>
                                            {calendar.summary}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        checked={addToMasterCalendarToo} 
                                        onChange={(e) => setAddToMasterCalendarToo(e.target.checked)} 
                                        className="master-checkbox"
                                    />
                                }
                                label="Also add to AMCAS Master Calendar"
                                className="checkbox-label"
                            />

                            <Box className="event-preview-container">
                                <Typography variant="subtitle2">Event Details:</Typography>
                                <Paper className="event-preview">
                                    <Typography className="preview-title">
                                        {selectedEventForCalendar.title}
                                    </Typography>
                                    <Typography className="preview-date">
                                        {selectedEventForCalendar.rawDate instanceof Date 
                                            ? format(selectedEventForCalendar.rawDate, 'EEEE, MMMM d, yyyy') 
                                            : selectedEventForCalendar.date}
                                        {selectedEventForCalendar.start_time && ` • ${selectedEventForCalendar.start_time}`}
                                        {selectedEventForCalendar.end_time && ` - ${selectedEventForCalendar.end_time}`}
                                    </Typography>
                                    {selectedEventForCalendar.location && (
                                        <Typography className="preview-location">
                                            Location: {selectedEventForCalendar.location}
                                        </Typography>
                                    )}
                                </Paper>
                            </Box>
                        </Stack>
                    )}
                </DialogContent>

                <DialogActions className="dialog-actions">
                    <Button 
                        onClick={() => setShowAddToCalendarDialog(false)} 
                        className="cancel-button"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleAddToCalendarSubmit} 
                        variant="contained" 
                        disabled={!selectedEventForCalendar}
                        className="submit-button"
                    >
                        Add to Calendar
                    </Button>
                </DialogActions>
            </Dialog>
        </UserLayout>
    );
};

export default TimelineCalendarPage;