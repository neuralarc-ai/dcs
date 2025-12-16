import { Tender, SubmittedTender } from '@/types';

export const tenderData: Tender[] = [
    {
        id: 1,
        dateSubmitted: '2025-12-01',
        name: 'Government IT Infrastructure Upgrade',
        deadline: '2025-12-20T17:00:00',
        quotedAmount: 2450000,
        ourSubmissionDate: '2025-12-15T14:30:00',
        status: 'submitted',
        description: 'Complete overhaul of government IT infrastructure including servers, networking equipment, and security systems.',
        requirements: 'Hardware procurement, installation, configuration, and 2-year maintenance contract.'
    },
    {
        id: 2,
        dateSubmitted: '2025-11-15',
        name: 'Smart City IoT Deployment',
        deadline: '2025-12-18T16:00:00',
        quotedAmount: 5800000,
        ourSubmissionDate: '2025-12-12T10:15:00',
        status: 'submitted',
        description: 'Deployment of IoT sensors and smart city infrastructure across metropolitan area.',
        requirements: 'Sensor installation, data platform setup, mobile app development, and integration with existing systems.'
    },
    {
        id: 3,
        dateSubmitted: '2025-12-05',
        name: 'Healthcare Management System',
        deadline: '2025-12-25T18:00:00',
        quotedAmount: 1850000,
        ourSubmissionDate: null,
        status: 'pending',
        description: 'Development and implementation of comprehensive healthcare management system for regional hospital network.',
        requirements: 'Custom software development, database design, staff training, and ongoing support.'
    },
    {
        id: 4,
        dateSubmitted: '2025-11-28',
        name: 'Cybersecurity Assessment & Implementation',
        deadline: '2025-12-22T15:00:00',
        quotedAmount: 980000,
        ourSubmissionDate: '2025-12-14T16:45:00',
        status: 'submitted',
        description: 'Comprehensive cybersecurity audit and implementation of security measures for financial institution.',
        requirements: 'Security assessment, penetration testing, firewall configuration, and employee training program.'
    },
    {
        id: 5,
        dateSubmitted: '2025-12-08',
        name: 'Cloud Migration Services',
        deadline: '2025-12-30T17:00:00',
        quotedAmount: 3200000,
        ourSubmissionDate: null,
        status: 'pending',
        description: 'Migration of legacy systems to cloud infrastructure with minimal downtime.',
        requirements: 'Cloud architecture design, data migration, application modernization, and staff training.'
    }
];

export const submittedTendersData: SubmittedTender[] = [
    {
        id: 1,
        dateSubmitted: '2025-12-10',
        name: 'Enterprise Software Development RFP',
        deadline: '2025-12-28T17:00:00',
        documentUrl: '#',
        documentName: 'Enterprise_Software_RFP.pdf'
    },
    {
        id: 2,
        dateSubmitted: '2025-12-08',
        name: 'Network Infrastructure Upgrade Tender',
        deadline: '2025-12-22T16:00:00',
        documentUrl: '#',
        documentName: 'Network_Infrastructure_Tender.pdf'
    },
    {
        id: 3,
        dateSubmitted: '2025-12-12',
        name: 'Data Center Modernization Project',
        deadline: '2025-12-30T18:00:00',
        documentUrl: '#',
        documentName: 'DataCenter_Modernization.pdf'
    },
    {
        id: 4,
        dateSubmitted: '2025-11-25',
        name: 'Cloud Security Implementation',
        deadline: '2025-12-20T15:00:00',
        documentUrl: '#',
        documentName: 'Cloud_Security_RFP.pdf'
    },
    {
        id: 5,
        dateSubmitted: '2025-12-14',
        name: 'Mobile Application Development',
        deadline: '2026-01-05T17:00:00',
        documentUrl: '#',
        documentName: 'Mobile_App_Development.pdf'
    }
];

