import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

const isAnalyticsEnabled = () => {
    return localStorage.getItem('atraves_analytics_optout') !== 'true';
};

export const trackPageView = (pageName: string) => {
    if (analytics && isAnalyticsEnabled()) {
        logEvent(analytics, 'page_view', {
            page_title: pageName,
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }
};

export const trackLocationSearch = (searchType: 'coordinates' | 'address' | 'place' | 'postal' | 'landmark') => {
    if (analytics && isAnalyticsEnabled()) {
        logEvent(analytics, 'location_search', {
            search_type: searchType
        });
    }
};

export const trackMessageSent = (location: { lat: number; lng: number }) => {
    if (analytics && isAnalyticsEnabled()) {
        logEvent(analytics, 'message_sent', {
            latitude: location.lat,
            longitude: location.lng
        });
    }
};

export const trackMessageViewed = (location: { lat: number; lng: number }) => {
    if (analytics && isAnalyticsEnabled()) {
        logEvent(analytics, 'message_viewed', {
            latitude: location.lat,
            longitude: location.lng
        });
    }
}; 