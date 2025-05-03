import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  emergencyContact: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
}

interface SignUpFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSuccess: (userData: { name: string; email: string }) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onClose, onSwitchToLogin, onSuccess }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    emergencyContact: {
      name: '',
      phoneNumber: '',
      relationship: ''
    }
  });

  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    subfield?: string
  ) => {
    if (subfield) {
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [subfield]: e.target.value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<SignUpFormData> = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!validatePhoneNumber(formData.emergencyContact.phoneNumber)) {
      newErrors.emergencyContact = {
        name: formData.emergencyContact.name,
        phoneNumber: 'Please enter a valid emergency contact number',
        relationship: formData.emergencyContact.relationship
      };
    }

    if (!formData.emergencyContact.name) {
      newErrors.emergencyContact = {
        ...newErrors.emergencyContact,
        name: formData.emergencyContact.name,
        phoneNumber: formData.emergencyContact.phoneNumber,
        relationship: 'Emergency contact name is required'
      };
    }

    if (!formData.emergencyContact.relationship) {
      newErrors.emergencyContact = {
        ...newErrors.emergencyContact,
        name: formData.emergencyContact.name,
        phoneNumber: formData.emergencyContact.phoneNumber,
        relationship: 'Relationship is required'
      };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Here you would typically make an API call to create the user account
      // Store the emergency contact information in localStorage for now
      localStorage.setItem('emergencyContact', JSON.stringify(formData.emergencyContact));
      
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Account created successfully!",
        description: "You can now log in with your credentials.",
      });

      onSuccess({ name: formData.emergencyContact.name, email: formData.email });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error creating account",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange(e, 'email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleInputChange(e, 'password')}
              className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange(e, 'confirmPassword')}
            className={errors.confirmPassword ? 'border-red-500' : ''}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="+1234567890"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange(e, 'phoneNumber')}
            className={errors.phoneNumber ? 'border-red-500' : ''}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
          
          <div className="space-y-2">
            <Label htmlFor="emergencyName">Contact Name</Label>
            <Input
              id="emergencyName"
              type="text"
              placeholder="Full Name"
              value={formData.emergencyContact.name}
              onChange={(e) => handleInputChange(e, 'emergencyContact', 'name')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Contact Phone Number</Label>
            <Input
              id="emergencyPhone"
              type="tel"
              placeholder="+1234567890"
              value={formData.emergencyContact.phoneNumber}
              onChange={(e) => handleInputChange(e, 'emergencyContact', 'phoneNumber')}
              className={errors.emergencyContact?.phoneNumber ? 'border-red-500' : ''}
            />
            {errors.emergencyContact?.phoneNumber && (
              <p className="text-sm text-red-500">{errors.emergencyContact.phoneNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Input
              id="relationship"
              type="text"
              placeholder="e.g., Parent, Sibling, Friend"
              value={formData.emergencyContact.relationship}
              onChange={(e) => handleInputChange(e, 'emergencyContact', 'relationship')}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm; 