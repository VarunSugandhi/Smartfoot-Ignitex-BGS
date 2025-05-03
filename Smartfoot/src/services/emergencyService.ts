// Using dynamic import for emailjs
let emailjs: any = null;

// Load emailjs dynamically
const loadEmailJS = async () => {
  if (!emailjs) {
    emailjs = await import('@emailjs/browser');
  }
  return emailjs;
};

interface EmergencyContact {
  name: string;
  phone: string;
  email: string;
  relationship: string;
}

interface EmergencyData {
  userId: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timestamp: Date;
  travelMode?: string;
  routeInfo?: {
    startLocation: string;
    endLocation: string;
    currentProgress?: number;
  };
}

class EmergencyService {
  private static readonly EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
  private static readonly EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
  private static readonly EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

  static async init() {
    const emailjsInstance = await loadEmailJS();
    emailjsInstance.init(this.EMAILJS_PUBLIC_KEY);
  }

  static formatLocation(location: { latitude: number; longitude: number; address?: string }) {
    if (location.address) {
      return location.address;
    }
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  }

  static async getUserEmergencyContact(userId: string): Promise<EmergencyContact> {
    // In a real application, this would fetch from your backend
    // For now, return mock data
    return {
      name: "Emergency Contact",
      phone: "+1234567890",
      email: "emergency@example.com",
      relationship: "Family Member"
    };
  }

  static async notifyEmergencyContact(
    emergencyData: EmergencyData,
    contact: EmergencyContact
  ): Promise<{ success: boolean; message?: string }> {
    try {
      if (!this.EMAILJS_SERVICE_ID || !this.EMAILJS_TEMPLATE_ID || !this.EMAILJS_PUBLIC_KEY) {
        throw new Error('EmailJS configuration is missing');
      }

      const locationString = emergencyData.location 
        ? this.formatLocation(emergencyData.location)
        : 'Location unavailable';

      const templateParams = {
        to_name: contact.name,
        user_name: 'User', // Replace with actual user name
        location: locationString,
        emergency_time: new Date().toLocaleString(),
        travel_mode: emergencyData.travelMode || 'Not specified',
        start_location: emergencyData.routeInfo?.startLocation || 'Not specified',
        end_location: emergencyData.routeInfo?.endLocation || 'Not specified',
        contact_phone: contact.phone,
        to_email: contact.email,
      };

      // Load emailjs and send notification
      const emailjsInstance = await loadEmailJS();
      await emailjsInstance.send(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_TEMPLATE_ID,
        templateParams
      );

      // In a real application, you might also want to:
      // 1. Send SMS notification
      // 2. Call emergency services API
      // 3. Update incident database
      // 4. Trigger real-time notifications to emergency response team

      return {
        success: true,
        message: 'Emergency contacts have been notified successfully'
      };
    } catch (error) {
      console.error('Failed to notify emergency contacts:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send emergency notification'
      };
    }
  }

  static async updateEmergencyStatus(
    userId: string,
    status: 'active' | 'resolved' | 'false_alarm'
  ): Promise<boolean> {
    try {
      // In a real application, this would update your backend
      console.log(`Emergency status updated for user ${userId}: ${status}`);
      return true;
    } catch (error) {
      console.error('Failed to update emergency status:', error);
      return false;
    }
  }
}

export default EmergencyService; 