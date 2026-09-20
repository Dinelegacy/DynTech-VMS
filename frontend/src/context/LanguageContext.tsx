'use client';

import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const dictionaries: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    overview: 'Overview',
    platform: 'Platform',
    pricing: 'Pricing',
    login: 'Log In',
    start_trial: 'Start Free Trial',

    // Hero Section
    hero_title: 'Transform RTSP Cameras into Intelligent VMS Feeds',
    hero_subtitle: 'Sub-second WebRTC streaming powered by MediaMTX with real-time browser canvas object detection and localized edge management.',
    book_demo: 'Book a Demo',
    explore_pipeline: 'Explore Pipeline',

    // Features Section
    features_heading_1: 'Built for scale.',
    features_heading_2: 'Engineered for zero latency.',
    features_tag_1: 'TELEMETRY PIPELINE',
    features_title_1: 'MediaMTX WHEP Engine',
    features_body_1: 'Direct WebRTC ingestion from standard RTSP streams. Delivers glass-to-glass video latency under 200ms without browser plugins or proprietary gateway hardware.',
    features_tag_2: 'SPATIAL ANALYTICS',
    features_title_2: 'Dynamic AI Inference',
    features_body_2: 'Run edge-level detection models dynamically per camera feed. Instantly index person tracking, bounding box overlays, and spatial incidents across your entire network.',

    // Pricing Section
    pricing_title: 'Predictable architecture pricing.',
    pricing_subtitle: 'Scale camera feeds without per-user penalties or hidden API bandwidth fees.',
    most_popular: 'MOST POPULAR',
    plan_period_month: '/month',
    get_started: 'Get Started',
    contact_sales: 'Contact Sales',
    plan_starter_name: 'Starter',
    plan_starter_tagline: 'For localized edge deployments.',
    plan_starter_f1: 'Up to 8 active camera streams',
    plan_starter_f2: 'MediaMTX WHEP low-latency pipeline',
    plan_starter_f3: '7-day local retention storage',
    plan_starter_f4: 'Community support access',
    plan_enterprise_name: 'Enterprise',
    plan_enterprise_tagline: 'For multi-facility infrastructure.',
    plan_enterprise_f1: 'Unlimited camera ingestion',
    plan_enterprise_f2: 'Real-time spatial AI analytics',
    plan_enterprise_f3: '30-day automated cloud backup',
    plan_enterprise_f4: 'Custom webhook triggers & API',
    plan_enterprise_f5: '24/7 dedicated support SLA',
    plan_custom_name: 'Custom',
    plan_custom_tagline: 'Dedicated hardware & air-gapped networks.',
    plan_custom_price: 'Custom',
    plan_custom_f1: 'On-premise edge server deployment',
    plan_custom_f2: 'Custom computer vision model training',
    plan_custom_f3: 'Air-gapped security compliance',
    plan_custom_f4: 'Dedicated integration engineer',

    // CTA Section
    cta_title: 'Ready to modernize your cameras?',
    cta_subtitle: 'Join security teams already running DynTech VMS. No hardware lock-in, no long-term contracts.',
    cta_fine_print: 'No credit card required · 14-day free trial · Cancel anytime',

    // Footer Section
    footer_privacy: 'Privacy',
    footer_terms: 'Terms',
    footer_docs: 'Docs',
    footer_support: 'Support',
    footer_rights: 'All rights reserved.',

    // Login Page
    login_title: 'Welcome back',
    login_subtitle: 'Enter your credentials to access your VMS dashboard',
    email_label: 'Email Address',
    email_placeholder: 'name@company.com',
    password_label: 'Password',
    password_placeholder: '••••••••',
    remember_me: 'Remember me',
    forgot_password: 'Forgot password?',
    sign_in_btn: 'Sign In',
    no_account: "Don't have an account?",

    // Sign Up / Free Trial Page
    signup_title: 'Start your 14-day free trial',
    signup_subtitle: 'No credit card required. Instant WebRTC camera connection.',
    full_name_label: 'Full Name',
    full_name_placeholder: 'Jane Doe',
    company_label: 'Company Name',
    company_placeholder: 'Acme Security',
    create_account_btn: 'Create Free Account',
    already_have_account: 'Already have an account?',

    // Demo View Page
    demo_title: 'Live VMS Stream Demo',
    demo_subtitle: 'Interactive MediaMTX WebRTC playback with dynamic browser canvas object detection.',
    select_stream: 'Select Active Stream',
    camera_stream_1: 'Main Entrance - RTSP 01',
    camera_stream_2: 'Perimeter Fence - RTSP 02',
    camera_stream_3: 'Warehouse Bay - RTSP 03',
    stream_status_live: 'LIVE WHEP STREAM',
    ai_bounding_boxes: 'AI Bounding Boxes',
    latency_label: 'Latency',
    fps_label: 'FPS',
    back_home: 'Back to Home',
  },
  fr: {
    // Navigation
    overview: 'Aperçu',
    platform: 'Plateforme',
    pricing: 'Tarifs',
    login: 'Se connecter',
    start_trial: 'Essai gratuit',

    // Hero Section
    hero_title: 'Transformez vos caméras RTSP en flux VMS intelligents',
    hero_subtitle: 'Streaming WebRTC sous la seconde propulsé par MediaMTX avec détection d\'objets en temps réel et gestion périphérique localisée.',
    book_demo: 'Réserver une démo',
    explore_pipeline: 'Explorer le pipeline',

    // Features Section
    features_heading_1: 'Conçu pour l\'échelle.',
    features_heading_2: 'Ingénierie pour une latence zéro.',
    features_tag_1: 'PIPELINE DE TÉLÉMÉTRIE',
    features_title_1: 'Moteur MediaMTX WHEP',
    features_body_1: 'Ingestion WebRTC directe à partir de flux RTSP standards. Offre une latence vidéo inférieure à 200 ms sans extensions ni matériel propriétaire.',
    features_tag_2: 'ANALYTIQUE SPATIALE',
    features_title_2: 'Inférence IA dynamique',
    features_body_2: 'Exécutez des modèles de détection sur la périphérie pour chaque caméra. Indexez instantanément le suivi des personnes et les incidents spatiaux sur votre réseau.',

    // Pricing Section
    pricing_title: 'Tarification d\'architecture prévisible.',
    pricing_subtitle: 'Faites évoluer les flux vidéo sans pénalités par utilisateur ni frais d\'API cachés.',
    most_popular: 'LE PLUS POPULAIRE',
    plan_period_month: '/mois',
    get_started: 'Commencer',
    contact_sales: 'Contacter l\'équipe commerciale',
    plan_starter_name: 'Débutant',
    plan_starter_tagline: 'Pour les déploiements locaux à la pointe.',
    plan_starter_f1: 'Jusqu\'à 8 flux vidéo actifs',
    plan_starter_f2: 'Pipeline MediaMTX WHEP à faible latence',
    plan_starter_f3: 'Stockage local de rétention de 7 jours',
    plan_starter_f4: 'Accès au support communautaire',
    plan_enterprise_name: 'Entreprise',
    plan_enterprise_tagline: 'Pour infrastructures multi-sites.',
    plan_enterprise_f1: 'Ingestion vidéo illimitée',
    plan_enterprise_f2: 'Analytique IA spatiale en temps réel',
    plan_enterprise_f3: 'Sauvegarde cloud automatisée de 30 jours',
    plan_enterprise_f4: 'Déclencheurs webhooks personnalisés et API',
    plan_enterprise_f5: 'SLA de support dédié 24/7',
    plan_custom_name: 'Sur mesure',
    plan_custom_tagline: 'Matériel dédié et réseaux isolés (air-gap).',
    plan_custom_price: 'Sur devis',
    plan_custom_f1: 'Déploiement sur serveur local',
    plan_custom_f2: 'Entraînement sur mesure de modèles de vision',
    plan_custom_f3: 'Conformité de sécurité pour réseaux isolés',
    plan_custom_f4: 'Ingénieur d\'intégration dédié',

    // CTA Section
    cta_title: 'Prêt à moderniser vos caméras ?',
    cta_subtitle: 'Rejoignez les équipes de sécurité qui utilisent déjà DynTech VMS. Sans engagement matériel ni contrat long terme.',
    cta_fine_print: 'Aucune carte de crédit requise · Essai gratuit de 14 jours · Annulation à tout moment',

    // Footer Section
    footer_privacy: 'Confidentialité',
    footer_terms: 'Conditions',
    footer_docs: 'Documentation',
    footer_support: 'Support',
    footer_rights: 'Tous droits réservés.',

    // Login Page
    login_title: 'Bon retour',
    login_subtitle: 'Saisissez vos identifiants pour accéder à votre tableau de bord VMS',
    email_label: 'Adresse e-mail',
    email_placeholder: 'nom@entreprise.com',
    password_label: 'Mot de passe',
    password_placeholder: '••••••••',
    remember_me: 'Se souvenir de moi',
    forgot_password: 'Mot de passe oublié ?',
    sign_in_btn: 'Se connecter',
    no_account: "Vous n'avez pas de compte ?",

    // Sign Up / Free Trial Page
    signup_title: 'Commencez votre essai gratuit de 14 jours',
    signup_subtitle: 'Aucune carte de crédit requise. Connexion caméra WebRTC instantanée.',
    full_name_label: 'Nom complet',
    full_name_placeholder: 'Jean Dupont',
    company_label: "Nom de l'entreprise",
    company_placeholder: 'Acme Sécurité',
    create_account_btn: 'Créer un compte gratuit',
    already_have_account: 'Vous avez déjà un compte ?',

    // Demo View Page
    demo_title: 'Démo du flux VMS en direct',
    demo_subtitle: 'Lecture WebRTC MediaMTX interactive avec détection d\'objets sur canevas en temps réel.',
    select_stream: 'Sélectionner le flux actif',
    camera_stream_1: 'Entrée principale - RTSP 01',
    camera_stream_2: 'Clôture périmétrique - RTSP 02',
    camera_stream_3: 'Zone d\'entreposage - RTSP 03',
    stream_status_live: 'FLUX WHEP EN DIRECT',
    ai_bounding_boxes: 'Cadres de détection IA',
    latency_label: 'Latence',
    fps_label: 'FPS',
    back_home: 'Retour à l\'accueil',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  const t = (key: string): string => {
    return dictionaries[lang]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}