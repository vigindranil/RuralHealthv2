import React, { useState, useEffect } from 'react';
import { X, Save, User, Phone, MapPin, Building } from 'lucide-react';
import { getUser } from '../utils/authUtils';
// Import both API functions from your dataEntry file
import { saveMatriMa, saveNonMatriMa } from '../api/dataEntry';
import SearchableSelect from './SearchableSelect';
import Cookies from 'js-cookie';
import axios from 'axios';
import { decodeJwtToken } from '../utils/decodetoken';
import { getAllHealthandIcdsCentres } from '../api/dropDownData';
import { useToast } from '../context/ToastContext';

interface FormModalProps {
  moduleId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mapping from API HMTypeID (as string) to config keys
const ID_TO_CONFIG_MAP: Record<string, string> = {
  '1': 'childbirths',
  '2': 'underage-marriage',
  '3': 'low-birth-weight',
  '4': 'incomplete-immunization',
  '5': 'young-pregnant-mothers',
  '6': 'teenage-pregnancy',
  '7': 'high-risk-pregnancy',
  '8': 'malnourished-children',
  '9': 'underweight-children',
  '10': 'anemic-girls',
  '11': 'infectious-diseases',
  '12': 'tb-leprosy',
};

// Define which forms should use the new `saveNonMatriMa` API.
const NON_MATRIMA_FORMS = new Set([
  'underage-marriage',
  'tb-leprosy',
  'infectious-diseases',
  'anemic-girls'
]);

// Configs extracted outside for performance
const MODULE_CONFIGS: Record<string, any> = {
  'underage-marriage': {
    title: 'Under Age Marriages',
    fields: [
      { id: 'name', label: 'Name', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'gramPanchayat', label: 'Gram Panchayat (GP)', type: 'text', readOnly: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'villageName', label: 'Village Name', type: 'text', required: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'husbandName', label: 'Husband Name', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'contactNo', label: 'Contact No', type: 'tel', required: true, icon: <Phone className="w-4 h-4" /> },
      { id: 'icdsCentreName', label: 'ICDS Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'icdsCentreId', label: 'ICDS Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreName', label: 'Health Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreId', label: 'Health Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
    ]
  },
  'childbirths': {
    title: 'Childbirths (Non-Institutional)',
    fields: [
      { id: 'motherMaId', label: "Mother's ID (Matri Ma ID)", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'motherName', label: 'Name', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'gramPanchayat', label: 'Gram Panchayat (GP)', type: 'text', readOnly: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'villageName', label: 'Village Name', type: 'text', required: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'husbandName', label: 'Husband Name', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'contactNo', label: 'Contact No', type: 'tel', required: true, icon: <Phone className="w-4 h-4" /> },
      { id: 'icdsCentreName', label: 'ICDS Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'icdsCentreId', label: 'ICDS Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreName', label: 'Health Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreId', label: 'Health Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
    ]
  },
  'low-birth-weight': {
    title: 'Children with Low Birth Weight',
    fields: [
      { id: 'motherMaId', label: "Mother's ID (Matri Ma ID)", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'motherName', label: "Mother's Name", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'childName', label: 'Child Name', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'childId', label: 'Child ID', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'gramPanchayat', label: 'Gram Panchayat (GP)', type: 'text', readOnly: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'villageName', label: 'Village Name', type: 'text', required: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'fatherName', label: "Father's Name", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'contactNo', label: 'Contact No', type: 'tel', required: true, icon: <Phone className="w-4 h-4" /> },
      { id: 'icdsCentreName', label: 'ICDS Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'icdsCentreId', label: 'ICDS Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreName', label: 'Health Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreId', label: 'Health Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
    ]
  },
  'incomplete-immunization': {
    title: 'Children who have not completed immunization',
    fields: [
      { id: 'motherMaId', label: "Mother's ID (Matri Ma ID)", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'motherName', label: "Mother's Name", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'childName', label: 'Child Name', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'childId', label: 'Child ID', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'weight', label: 'Weight (kg)', type: 'number', step: '0.1', required: true },
      { id: 'gramPanchayat', label: 'Gram Panchayat (GP)', type: 'text', readOnly: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'villageName', label: 'Village Name', type: 'text', required: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'fatherName', label: "Father's Name", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'contactNo', label: 'Contact No', type: 'tel', required: true, icon: <Phone className="w-4 h-4" /> },
      { id: 'icdsCentreName', label: 'ICDS Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'icdsCentreId', label: 'ICDS Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreName', label: 'Health Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreId', label: 'Health Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
    ]
  },
  'young-pregnant-mothers': {
    title: 'Under 20 years of age pregnant mothers',
    fields: [
      { id: 'motherMaId', label: "Mother's ID (Matri Ma ID)", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'motherName', label: "Mother's Name", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'gramPanchayat', label: 'Gram Panchayat (GP)', type: 'text', readOnly: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'villageName', label: 'Village Name', type: 'text', required: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'husbandName', label: 'Husband Name', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'contactNo', label: 'Contact No', type: 'tel', required: true, icon: <Phone className="w-4 h-4" /> },
      { id: 'icdsCentreName', label: 'ICDS Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'icdsCentreId', label: 'ICDS Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreName', label: 'Health Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreId', label: 'Health Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
    ]
  },
  'teenage-pregnancy': {
    title: 'Teenage pregnancy registered',
    fields: [
      { id: 'motherMaId', label: "Mother's ID (Matri Ma ID)", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'motherName', label: "Mother's Name", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'gramPanchayat', label: 'Gram Panchayat (GP)', type: 'text', readOnly: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'villageName', label: 'Village Name', type: 'text', required: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'husbandName', label: 'Husband Name', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'contactNo', label: 'Contact No', type: 'tel', required: true, icon: <Phone className="w-4 h-4" /> },
      { id: 'icdsCentreName', label: 'ICDS Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'icdsCentreId', label: 'ICDS Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreName', label: 'Health Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreId', label: 'Health Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
    ]
  },
  'high-risk-pregnancy': {
    title: 'Pregnant women with high-risk pregnancy',
    fields: [
      { id: 'motherMaId', label: "Mother's ID (Matri Ma ID)", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'motherName', label: "Mother's Name", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'gramPanchayat', label: 'Gram Panchayat (GP)', type: 'text', readOnly: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'villageName', label: 'Village Name', type: 'text', required: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'husbandName', label: 'Husband Name', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'contactNo', label: 'Contact No', type: 'tel', required: true, icon: <Phone className="w-4 h-4" /> },
      { id: 'icdsCentreName', label: 'ICDS Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'icdsCentreId', label: 'ICDS Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreName', label: 'Health Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreId', label: 'Health Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
    ]
  },
  'malnourished-children': {
    title: 'Malnourished Children',
    fields: [
      { id: 'motherMaId', label: "Mother's ID (Matri Ma ID)", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'motherName', label: "Mother's Name", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'childName', label: 'Child Name', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'childId', label: 'Child ID', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'childDob', label: 'Date of Birth', type: 'date', required: false },
      { id: 'weight', label: 'Weight (kg)', type: 'number', step: '0.1', required: true },
      { id: 'gramPanchayat', label: 'Gram Panchayat (GP)', type: 'text', readOnly: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'villageName', label: 'Village Name', type: 'text', required: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'fatherName', label: "Father's Name", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'contactNo', label: 'Contact No', type: 'tel', required: true, icon: <Phone className="w-4 h-4" /> },
      { id: 'icdsCentreName', label: 'ICDS Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'icdsCentreId', label: 'ICDS Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreName', label: 'Health Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreId', label: 'Health Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
    ]
  },
  'underweight-children': {
    title: 'Severely Underweight children',
    fields: [
      { id: 'motherMaId', label: "Mother's ID (Matri Ma ID)", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'motherName', label: "Mother's Name", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'childName', label: 'Child Name', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'childId', label: 'Child ID', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'childDob', label: 'Date of Birth', type: 'date', required: false },
      { id: 'weight', label: 'Weight (kg)', type: 'number', step: '0.1', required: true },
      { id: 'gramPanchayat', label: 'Gram Panchayat (GP)', type: 'text', readOnly: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'villageName', label: 'Village Name', type: 'text', required: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'fatherName', label: "Father's Name", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'contactNo', label: 'Contact No', type: 'tel', required: true, icon: <Phone className="w-4 h-4" /> },
      { id: 'icdsCentreName', label: 'ICDS Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'icdsCentreId', label: 'ICDS Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreName', label: 'Health Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreId', label: 'Health Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
    ]
  },
  'anemic-girls': {
    title: 'Adolescent Girls who are Anemic',
    fields: [
      { id: 'name', label: 'Name', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'age', label: 'Age', type: 'number', required: true },
      { id: 'childDob', label: 'Date of Birth', type: 'date', required: false },
      { id: 'weight', label: 'Weight (kg)', type: 'number', step: '0.1', required: true },
      { id: 'gramPanchayat', label: 'Gram Panchayat (GP)', type: 'text', readOnly: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'villageName', label: 'Village Name', type: 'text', required: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'fatherHusbandName', label: "Father's/Husband's Name", type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'contactNo', label: 'Contact No', type: 'tel', required: true, icon: <Phone className="w-4 h-4" /> },
      { id: 'icdsCentreName', label: 'ICDS Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'icdsCentreId', label: 'ICDS Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreName', label: 'Health Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreId', label: 'Health Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
    ]
  },
  'infectious-diseases': {
    title: 'Infectious Diseases',
    fields: [
      { id: 'diseaseName', label: 'Infectious Disease Name', type: 'select', options: ['Dengue', 'Malaria', 'Kala azar', 'Japanese Encephalitis'], required: true },
      { id: 'affectedPersonName', label: 'Name of affected people', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'gramPanchayat', label: 'Gram Panchayat (GP)', type: 'text', readOnly: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'villageName', label: 'Village Name', type: 'text', required: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'contactNo', label: 'Contact No', type: 'tel', required: true, icon: <Phone className="w-4 h-4" /> },
      { id: 'icdsCentreName', label: 'ICDS Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'icdsCentreId', label: 'ICDS Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreName', label: 'Health Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreId', label: 'Health Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
    ]
  },
  'tb-leprosy': {
    title: 'TB and leprosy patients',
    fields: [
      { id: 'patientName', label: 'Name TB/leprosy patients', type: 'text', required: true, icon: <User className="w-4 h-4" /> },
      { id: 'gramPanchayat', label: 'Gram Panchayat (GP)', type: 'text', readOnly: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'villageName', label: 'Village Name', type: 'text', required: true, icon: <MapPin className="w-4 h-4" /> },
      { id: 'contactNo', label: 'Contact No', type: 'tel', required: true, icon: <Phone className="w-4 h-4" /> },
      { id: 'nikshayMitra', label: 'Ni-kshay Mitra', type: 'select', options: ['Yes', 'No'], required: true },
      { id: 'icdsCentreName', label: 'ICDS Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'icdsCentreId', label: 'ICDS Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreName', label: 'Health Centre Name', type: 'select', required: true, icon: <Building className="w-4 h-4" /> },
      { id: 'healthCentreId', label: 'Health Centre ID', type: 'text', required: true, readOnly: true, icon: <Building className="w-4 h-4" /> },
    ]
  },
  'toilet-facilities': {
    title: 'Monthly Toilet Facilities Update',
    fields: [
      { id: 'householdsWithToilets', label: 'Households with toilet facilities', type: 'number', required: true },
      { id: 'householdsUsingToilets', label: 'Households that use toilets', type: 'number', required: true },
      { id: 'usableToilets', label: 'Household toilets that are usable', type: 'number', required: true },
      { id: 'singlePitToilets', label: 'Households with single-pit toilets', type: 'number', required: true },
      { id: 'twinPitToilets', label: 'Households with twin-pit toilets', type: 'number', required: true },
      { id: 'septicTankToilets', label: 'Families with septic tank toilets', type: 'number', required: true },
      { id: 'septicTankCleaning', label: 'Are toilets with septic tanks cleaned regularly', type: 'select', options: ['Yes', 'No', 'Partially'], required: true },
    ]
  }
};


export default function FormModal({ moduleId, isOpen, onClose }: FormModalProps) {
  const user = getUser() || { id: '1', role: 'GP' };
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [icdsCentres, setIcdsCentres] = useState<{ name: string; id: string }[]>([]);
  const [healthCentres, setHealthCentres] = useState<{ name: string; id: string }[]>([]);
  const [dropdownError, setDropdownError] = useState<string | null>(null);

  const token = Cookies.get('authToken');
  const decoded = decodeJwtToken(token);
  const { showToast } = useToast();

  const GPID = decoded?.BoundaryID || '0';
  const GPName = decoded?.BoundaryName || 'Gram Panchayat';
  const UserID = decoded?.UserID || user.id;

  const normalizedId = moduleId ? ID_TO_CONFIG_MAP[moduleId] || moduleId : null;
  const config = normalizedId ? MODULE_CONFIGS[normalizedId] || { title: 'Unknown Module', fields: [] } : { title: 'Unknown Module', fields: [] };

  const ICDS_CENTRES = [
    { name: 'ICDS-1', id: 'ICDS001' },
    { name: 'ICDS-2', id: 'ICDS002' },
    { name: 'ICDS-3', id: 'ICDS003' },
  ];
  const HEALTH_CENTRES = [
    { name: 'Jalpaiguri PHC', id: 'HC001' },
    { name: 'Belakoba PHC', id: 'HC002' },
  ];

  const HIDDEN_FIELD_IDS = ['icdsCentreId', 'healthCentreId'];

  const defaultValues = React.useMemo(() => {
    if (!normalizedId) return {};
    const cfg = MODULE_CONFIGS[normalizedId];
    if (!cfg) return {};
    return cfg.fields.reduce((acc: Record<string, string>, f: any) => {
      if (f.defaultValue !== undefined) acc[f.id] = f.defaultValue;
      return acc;
    }, {});
  }, [normalizedId]);

  useEffect(() => {
    if (isOpen) {
      const initialFormData = {
        ...defaultValues,
        gramPanchayat: GPName,
      };
      setFormData(initialFormData);
    } else {
      setFormData({});
    }
  }, [isOpen, defaultValues, GPName]);

  useEffect(() => {
    async function fetchDropdownData() {
      setDropdownError(null);
      try {
        const data = await getAllHealthandIcdsCentres();
        if (data && Array.isArray(data.data.healthCentres) && Array.isArray(data.data.icdsCentres)) {
          setIcdsCentres(data.data.icdsCentres.map((item: any) => ({
            name: item.ICDSCentreName || item.name || "Unknown ICDS",
            id: String(item.ICDSCentreID ?? ""),
            healthCentreId: String(item.HealthCentreID ?? "")
          })));
          setHealthCentres(data.data.healthCentres.map((item: any) => ({
            name: item.HealthCentreName || "Unknown Health Centre",
            id: String(item.HealthCentreID ?? "")
          })));
        } else {
          setDropdownError("Failed to load centres.");
        }
      } catch (err) {
        setDropdownError("Error loading centres.");
      }
    }
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  if (!isOpen || !moduleId) return null;

  // --- CORRECTED handleSubmit FUNCTION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalizedId) {
      showToast('Error: Module ID is missing.', 'error');
      return;
    }
    setLoading(true);

    const orZero = (v: any) => (v === undefined || v === null || String(v).trim() === '') ? '0' : String(v).trim();
    const orEmpty = (v: any) => v || '';

    try {
      let response;

      // Determine which API to call based on the form type
      if (NON_MATRIMA_FORMS.has(normalizedId)) {
        // --- Payload for saveNonMatriMa ---
        const payload: any = {
          InHMID: '0', DistrictID: '0', SubDivisionID: '0', IsUrban: '0',
          MunicipalityID: '0', BlockID: '0', GPID: GPID,
          VillageName: orEmpty(formData.villageName),
          HealthCentreID: orZero(formData.healthCentreId),
          ICDSCentreID: orZero(formData.icdsCentreId),
          HMTypeID: moduleId,
          EntryUserID: UserID,
          ContactNo: orZero(formData.contactNo),
        };

        // Add form-specific fields
        switch (normalizedId) {
          case 'underage-marriage':
            payload.GirlName = orEmpty(formData.name);
            payload.HusbandName = orEmpty(formData.husbandName);
            break;
          case 'anemic-girls':
            payload.GirlName = orEmpty(formData.name);
            payload.GirlAge = orZero(formData.age);
            payload.GirlWeight = orZero(formData.weight);
            payload.GirlFatherName = orEmpty(formData.fatherHusbandName);
            break;
          case 'tb-leprosy':
            payload.TBLeprosyPatientName = orEmpty(formData.patientName);
            payload.NikshayMitra = formData.nikshayMitra === 'Yes' ? '1' : '0';
            break;
          case 'infectious-diseases':
            payload.AffectedPersonName = orEmpty(formData.affectedPersonName);
            payload.InfectiousDiseaseID = '0'; // Placeholder
            break;
        }

        console.log('Submitting to Non-MatriMa API with payload:', payload);
        response = await saveNonMatriMa(payload);

      } else {
        // --- Payload for saveMatriMa (existing logic) ---
        const payload = {
          MatriMaRelatedInfoID: '0', DistrictID: '0', BlockID: '0', GPID: GPID,
          VillageName: orEmpty(formData.villageName),
          HealthCentreID: orZero(formData.healthCentreId),
          ICDSCentreID: orZero(formData.icdsCentreId),
          SubDivisionID: '0', MunicipalityID: '0', IsUrban: '0',
          HMTypeID: moduleId,
          ContactNo: orZero(formData.contactNo),
          MatriMaID: orZero(formData.motherMaId),
          MotherName: orEmpty(formData.motherName),
          FatherName: orEmpty(formData.fatherName),
          HusbandName: orEmpty(formData.husbandName),
          ChildName: orEmpty(formData.childName),
          ChildID: orZero(formData.childId),
          ChildDOB: orEmpty(formData.childDob) || null,
          ChildWeight: orZero(formData.weight),
          EntryUserID: UserID,
        };

        console.log('Submitting to MatriMa API with payload:', payload);
        response = await saveMatriMa(payload);
      }

      console.log('API response:', response);

      if (response.status === 0) {
        showToast(response.message || 'Data saved successfully!', 'success');
        onClose();
      } else {
        showToast(response.message || 'An unknown error occurred.', 'error');
      }

    } catch (err) {
      console.error('API submission error:', err);
      const errorMessage = (axios.isAxiosError(err) && err.response?.data?.message)
        ? err.response.data.message
        : 'Failed to submit data. Please check the console for details.';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => {
      if (fieldId === 'icdsCentreName') {
        const found = icdsCentres.find(c => c.name === value) || ICDS_CENTRES.find(c => c.name === value);
        return { ...prev, icdsCentreName: value, icdsCentreId: found ? String(found.id) : '' };
      }
      if (fieldId === 'healthCentreName') {
        const found = healthCentres.find(c => c.name === value) || HEALTH_CENTRES.find(c => c.name === value);
        return { ...prev, healthCentreName: value, healthCentreId: found ? String(found.id) : '' };
      }
      return { ...prev, [fieldId]: value };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[100vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{config.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.fields
                .filter((field: any) => !HIDDEN_FIELD_IDS.includes(field.id))
                .map((field: any) => (
                  <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>

                    {field.type === 'select' ? (
                      <SearchableSelect
                        value={formData[field.id] || ''}
                        onChange={(val) => handleInputChange(field.id, val)}
                        options={
                          field.id === 'icdsCentreName'
                            ? (icdsCentres.length ? icdsCentres : ICDS_CENTRES)
                            : field.id === 'healthCentreName'
                              ? (healthCentres.length ? healthCentres : HEALTH_CENTRES)
                              : (field.options || []).map((o: string) => ({ id: o, name: o }))
                        }
                        placeholder={`Select ${field.label}`}
                        disabled={field.readOnly}
                      />
                    ) : field.type === 'textarea' ? (
                      <textarea
                        id={field.id}
                        required={field.required}
                        value={formData[field.id] || field.defaultValue || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    ) : (
                      <div className="relative">
                        {field.icon && (
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {field.icon}
                          </div>
                        )}
                        <input
                          id={field.id}
                          type={field.type}
                          step={field.step}
                          required={field.required}
                          value={formData[field.id] || field.defaultValue || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className={`w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${field.icon ? 'pl-10 pr-3' : 'px-3'}`}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          pattern={field.id === 'contactNo' ? '[0-9]{10}' : undefined}
                          maxLength={field.id === 'contactNo' ? 10 : undefined}
                          inputMode={field.id === 'contactNo' ? 'numeric' : undefined}
                          disabled={field.readOnly || (field.id === 'gramPanchayat')}
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving....' : 'Save Data'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}