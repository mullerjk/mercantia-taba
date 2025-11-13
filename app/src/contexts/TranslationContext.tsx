'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'pt' | 'en' | 'es';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Translation files
const translations = {
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.marketplace': 'Mercado',
    'nav.cart': 'Carrinho',
    'nav.settings': 'Configurações',

    // Home/Timeline
    'home.liveUpdates': 'Atualizações ao Vivo',
    'home.watching': 'Monitorando novas atualizações do Schema.org...',

    // Marketplace
    'marketplace.title': 'Mercado Mercantia',
    'marketplace.discover': 'Descobrir & Conectar',
    'marketplace.search': 'Buscar produtos, organizações, lugares...',
    'marketplace.organizations': 'Organizações',
    'marketplace.departments': 'Departamentos',
    'marketplace.totalItems': 'itens totais no marketplace',
    'marketplace.searchFor': 'Busca por',

    // Cart
    'cart.addToCart': 'Adicionar ao Carrinho',
    'cart.viewCart': 'Ver Carrinho',
    'cart.quantity': 'quantidade',

    // Entity types
    'entity.person': 'Pessoa',
    'entity.organization': 'Organização',
    'entity.product': 'Produto',
    'entity.place': 'Lugar',

    // Actions
    'action.viewDetails': 'Ver Detalhes',
    'action.loadMore': 'Carregar Mais',
    'action.clearFilter': 'Limpar Filtro',

    // Status
    'status.live': 'Ao Vivo',
    'status.loading': 'Carregando...',
    'status.noResults': 'Nenhum resultado encontrado',

    // Categories
    'category.software': 'Software',
    'category.technology': 'Tecnologia',
    'category.company': 'Empresa',

    // Organization Page
    'organization.about': 'Sobre',
    'organization.departments': 'Departamentos',
    'organization.products': 'Produtos',
    'organization.location': 'Localização',
    'organization.founded': 'Fundada em',
    'organization.visitWebsite': 'Visitar Site',
    'organization.noDescription': 'Nenhuma descrição disponível.',
    'organization.noDepartments': 'Nenhum departamento encontrado.',
    'organization.noProducts': 'Nenhum produto encontrado.',
    'organization.moreProducts': 'E mais produtos...',
    'organization.loading': 'Carregando organização...',
    'organization.notFound': 'Organização Não Encontrada',
    'organization.notFoundDesc': 'A organização que você está procurando não existe.',
    'organization.goBack': 'Voltar',
    'organization.backToMarketplace': 'Voltar ao Marketplace',

    // Product Page
    'product.productImage': 'Product Image',
    'product.description': 'Description',
    'product.specifications': 'Specifications',
    'product.category': 'Category',
    'product.type': 'Type',
    'product.price': 'Price',
    'product.id': 'ID',
    'product.purchaseSection': 'Purchase Section',
    'product.freeShipping': 'Free shipping on orders over $50',
    'product.department': 'Department',
    'product.manufacturer': 'Manufacturer',
    'product.productCategory': 'Product Category',
    'product.browseMore': 'Browse more products in this category.',
    'product.customerReviews': 'Customer Reviews',
    'product.outOfStars': 'out of 5 stars',
    'product.basedOnReviews': 'Based on customer reviews',
    'product.noImage': 'No image available',
    'product.loading': 'Loading product...',
    'product.notFound': 'Product Not Found',
    'product.notFoundDesc': 'The product you\'re looking for doesn\'t exist.',
    'product.goBack': 'Go Back',
    'product.backToMarketplace': 'Back to Marketplace',
    'product.viewDetails': 'View Details',
    'product.addToCart': 'Add to Cart',

    // Department Page
    'department.products': 'Produtos',
    'department.organization': 'Organização',
    'department.departmentStats': 'Estatísticas do Departamento',
    'department.noProducts': 'Nenhum produto encontrado',
    'department.noProductsDesc': 'Este departamento ainda não tem produtos.',
    'department.loading': 'Carregando departamento...',
    'department.backToMarketplace': 'Voltar ao Marketplace',
    'department.badge': 'Departamento',
    'department.priceRange': 'Faixa de Preço',
    'department.totalValue': 'Valor Total',
    'department.addToCart': 'Adicionar ao Carrinho',
    'department.viewDetails': 'Ver Detalhes',

    // Home Page Mini-cards
    'home.role': 'Função',
    'home.company': 'Empresa',
    'home.contact': 'Contato',
    'home.type': 'Tipo',
    'home.founded': 'Fundada',
    'home.website': 'Site',
    'home.price': 'Preço',
    'home.category': 'Categoria',
    'home.brand': 'Marca',
    'home.product': 'Produto',
    'home.organization': 'Organização',
    'home.person': 'Pessoa',

    // Sidebar
    'sidebar.current': 'Current:',
    'sidebar.selected': 'Selected:',
    'sidebar.loadingSchema': 'Loading Schema.org entities...',
    'sidebar.failedToLoad': 'Failed to load schema entities',
    'sidebar.retry': 'Retry',
    'sidebar.searchEntities': 'Search entities...',
    'sidebar.entitiesLoaded': 'entities loaded',
    'sidebar.matching': 'matching',
    'sidebar.noEntitiesFound': 'No entities found matching',
    'sidebar.subtypes': 'subtypes',
    'sidebar.abstract': 'abstract',

    // Marketplace Page
    'marketplace.noOrganizations': 'Nenhuma organização encontrada',
    'marketplace.noOrganizationsDesc': 'As organizações aparecerão aqui quando registradas no sistema.',
    'marketplace.noDepartments': 'Nenhum departamento encontrado',
    'marketplace.noDepartmentsDesc': 'Os departamentos de produtos aparecerão aqui quando produtos forem registrados.',
    'marketplace.noProducts': 'Nenhum produto encontrado',
    'marketplace.noProductsDesc': 'Os produtos aparecerão aqui quando registrados no sistema.',
    'marketplace.product': 'produto',
    'marketplace.products': 'produtos',
    'marketplace.items': 'itens',
    'marketplace.viewCart': 'Ver Carrinho',

    // Settings Page
    'settings.title': 'Configurações',
    'settings.subtitle': 'Personalize sua experiência no Schema Explorer',
    'settings.appearance': 'Aparência',
    'settings.languageRegion': 'Idioma e Região',
    'settings.navigation': 'Navegação',
    'settings.notifications': 'Notificações',
    'settings.dataPrivacy': 'Dados e Privacidade',
    'settings.support': 'Suporte',
    'settings.manageSettings': 'Gerenciar configurações',
    'settings.theme': 'Tema',
    'settings.themeDesc': 'Escolha entre tema claro, escuro ou automático',
    'settings.language': 'Idioma',
    'settings.languageDesc': 'Selecione o idioma da interface',
    'settings.timezone': 'Fuso Horário',
    'settings.timezoneDesc': 'Configure seu fuso horário local',
    'settings.sidebarDefault': 'Sidebar Visível por Padrão',
    'settings.sidebarDefaultDesc': 'Mostrar sidebar ao carregar a página',
    'settings.animations': 'Animações',
    'settings.animationsDesc': 'Ativar animações de transição',
    'settings.systemNotifications': 'Notificações do Sistema',
    'settings.systemNotificationsDesc': 'Receber notificações sobre atualizações',
    'settings.notificationSounds': 'Sons de Notificação',
    'settings.notificationSoundsDesc': 'Reproduzir sons para notificações',
    'settings.autosave': 'Auto-save',
    'settings.autosaveDesc': 'Salvar automaticamente as configurações',
    'settings.clearCache': 'Limpar Dados Cache',
    'settings.clearCacheDesc': 'Remove dados temporários do navegador',
    'settings.about': 'Sobre',
    'settings.aboutDesc': 'Informações sobre o World Explorer',
    'settings.help': 'Ajuda e Documentação',
    'settings.helpDesc': 'Acessar guias e tutoriais',
    'settings.enabled': 'Ativado',
    'settings.disabled': 'Desativado',
    'settings.viewInfo': 'Ver Informações',
    'settings.openHelp': 'Abrir Ajuda',
    'settings.clearCacheBtn': 'Limpar Cache',

    // Checkout Page
    'checkout.title': 'Finalizar Compra',
    'checkout.subtitle': 'Complete sua compra',
    'checkout.backToMarketplace': 'Voltar ao Marketplace',
    'checkout.emptyCart': 'Seu carrinho está vazio',
    'checkout.emptyCartDesc': 'Adicione alguns itens ao seu carrinho antes de finalizar a compra.',
    'checkout.continueShopping': 'Continuar Comprando',
    'checkout.orderSummary': 'Resumo do Pedido',
    'checkout.reviewItems': 'Revise seus itens antes de finalizar',
    'checkout.quantity': 'quantidade',
    'checkout.remove': 'Remover',
    'checkout.shippingInfo': 'Informações de Entrega',
    'checkout.firstName': 'Nome',
    'checkout.lastName': 'Sobrenome',
    'checkout.email': 'E-mail',
    'checkout.phone': 'Telefone',
    'checkout.address': 'Endereço',
    'checkout.city': 'Cidade',
    'checkout.state': 'Estado',
    'checkout.zipCode': 'CEP',
    'checkout.country': 'País',
    'checkout.paymentInfo': 'Informações de Pagamento',
    'checkout.billingSameAsShipping': 'Endereço de cobrança igual ao de entrega',
    'checkout.paymentMethod': 'Método de Pagamento',
    'checkout.creditDebitCard': 'Cartão de Crédito/Débito',
    'checkout.paypal': 'PayPal',
    'checkout.bankTransfer': 'Transferência Bancária',
    'checkout.cardNumber': 'Número do Cartão',
    'checkout.expiryDate': 'Data de Validade',
    'checkout.cvv': 'CVV',
    'checkout.orderSummaryTitle': 'Resumo do Pedido',
    'checkout.subtotal': 'Subtotal',
    'checkout.shipping': 'Entrega',
    'checkout.free': 'Grátis',
    'checkout.tax': 'Imposto',
    'checkout.total': 'Total',
    'checkout.placeOrder': 'Finalizar Pedido',
    'checkout.termsAgreement': 'Ao finalizar seu pedido, você concorda com nossos termos e condições.',
    'checkout.secureCheckout': 'Compra Segura',
    'checkout.secureCheckoutDesc': 'Suas informações de pagamento são criptografadas e seguras. Usamos criptografia SSL padrão da indústria.',
    'checkout.items': 'itens',

    // Global Structure
    'globalStructure.title': 'Estrutura Global',
    'globalStructure.subtitle': 'Explore a estrutura completa do Schema.org com todas as entidades atualizadas.',
    'globalStructure.explore': 'Explorar',

    // Donations
    'donations.title': 'Doações por Amor',
    'donations.subtitle': 'Gerencie campanhas de doação e apoie causas importantes',
    'donations.search': 'Buscar',
    'donations.filter': 'Filtrar',
    'donations.newCampaign': 'Nova Campanha',
    'donations.statistics': 'Estatísticas',
    'donations.activeCampaigns': 'Campanhas Ativas',
    'donations.totalRaised': 'Total Arrecadado',
    'donations.donors': 'Doadores',
    'donations.goalAchieved': 'Meta Atingida',
    'donations.actions': 'Ações',
    'donations.createCampaign': 'Criar Campanha',
    'donations.reports': 'Relatórios',
    'donations.manageDonors': 'Gerenciar Doadores',
    'donations.campaigns': 'Campanhas de Doação',
    'donations.loadMore': 'Carregar Mais Campanhas',
    'donations.humanitarian': 'Humanitária',
    'donations.education': 'Educação',
    'donations.environment': 'Meio Ambiente',
    'donations.health': 'Saúde',
    'donations.active': 'Ativa',
    'donations.paused': 'Pausada',
    'donations.completed': 'Concluída',
    'donations.cancelled': 'Cancelada',
    'donations.until': 'Até',

    // Common
    'common.back': 'Voltar',
    'common.close': 'Fechar',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.yes': 'Sim',
    'common.no': 'Não',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.marketplace': 'Marketplace',
    'nav.cart': 'Cart',
    'nav.settings': 'Settings',

    // Home/Timeline
    'home.liveUpdates': 'Live Updates',
    'home.watching': 'Watching for new Schema.org updates...',
    'home.noUpdatesFound': 'No updates found for',
    'home.tryDifferentEntity': 'Try selecting a different entity type or wait for new updates.',
    'home.showAllUpdates': 'Show All Updates',
    'home.live': 'Live',

    // Home Page Mini-cards
    'home.role': 'Role',
    'home.company': 'Company',
    'home.contact': 'Contact',
    'home.type': 'Type',
    'home.founded': 'Founded',
    'home.website': 'Website',
    'home.price': 'Price',
    'home.category': 'Category',
    'home.brand': 'Brand',
    'home.product': 'Product',
    'home.organization': 'Organization',
    'home.person': 'Person',

    // Sidebar
    'sidebar.current': 'Current:',
    'sidebar.selected': 'Selected:',
    'sidebar.loadingSchema': 'Loading Schema.org entities...',
    'sidebar.failedToLoad': 'Failed to load schema entities',
    'sidebar.retry': 'Retry',
    'sidebar.searchEntities': 'Search entities...',
    'sidebar.entitiesLoaded': 'entities loaded',
    'sidebar.matching': 'matching',
    'sidebar.noEntitiesFound': 'No entities found matching',
    'sidebar.subtypes': 'subtypes',
    'sidebar.abstract': 'abstract',

    // Marketplace
    'marketplace.title': 'Mercantia Marketplace',
    'marketplace.discover': 'Discover & Connect',
    'marketplace.search': 'Search products, organizations, places...',
    'marketplace.organizations': 'Organizations',
    'marketplace.departments': 'Departments',
    'marketplace.products': 'Products',
    'marketplace.totalItems': 'total items in marketplace',
    'marketplace.searchFor': 'Search for',
    'marketplace.organizationsTitle': 'Organizations',
    'marketplace.organizationsDesc': 'Discover and connect with companies and organizations',
    'marketplace.departmentsTitle': 'Product Departments',
    'marketplace.departmentsDesc': 'Browse products by category and department',
    'marketplace.productsTitle': 'Products',
    'marketplace.productsDesc': 'Browse and purchase products from our marketplace',
    'marketplace.noOrganizations': 'No organizations found',
    'marketplace.noOrganizationsDesc': 'Organizations will appear here when registered in the system.',
    'marketplace.noDepartments': 'No departments found',
    'marketplace.noDepartmentsDesc': 'Product departments will appear here when products are registered.',
    'marketplace.noProducts': 'No products found',
    'marketplace.noProductsDesc': 'Products will appear here when registered in the system.',
    'marketplace.product': 'product',
    'marketplace.products': 'products',
    'marketplace.items': 'items',
    'marketplace.viewCart': 'View Cart',

    // Cart
    'cart.addToCart': 'Add to Cart',
    'cart.viewCart': 'View Cart',
    'cart.quantity': 'quantity',

    // Entity types
    'entity.person': 'Person',
    'entity.organization': 'Organization',
    'entity.product': 'Product',
    'entity.place': 'Place',

    // Actions
    'action.viewDetails': 'View Details',
    'action.loadMore': 'Load More',
    'action.clearFilter': 'Clear Filter',

    // Status
    'status.live': 'Live',
    'status.loading': 'Loading...',
    'status.noResults': 'No results found',

    // Categories
    'category.software': 'Software',
    'category.technology': 'Technology',
    'category.company': 'Company',

    // Organization Page
    'organization.about': 'About',
    'organization.departments': 'Departments',
    'organization.products': 'Products',
    'organization.location': 'Location',
    'organization.founded': 'Founded',
    'organization.visitWebsite': 'Visit Website',
    'organization.noDescription': 'No description available.',
    'organization.noDepartments': 'No departments found.',
    'organization.noProducts': 'No products found.',
    'organization.moreProducts': 'And more products...',
    'organization.loading': 'Loading organization...',
    'organization.notFound': 'Organization Not Found',
    'organization.notFoundDesc': 'The organization you\'re looking for doesn\'t exist.',
    'organization.goBack': 'Go Back',
    'organization.backToMarketplace': 'Back to Marketplace',

    // Settings Page
    'settings.title': 'Settings',
    'settings.subtitle': 'Customize your Schema Explorer experience',
    'settings.appearance': 'Appearance',
    'settings.languageRegion': 'Language & Region',
    'settings.navigation': 'Navigation',
    'settings.notifications': 'Notifications',
    'settings.dataPrivacy': 'Data & Privacy',
    'settings.support': 'Support',
    'settings.manageSettings': 'Manage settings',
    'settings.theme': 'Theme',
    'settings.themeDesc': 'Choose between light, dark or automatic theme',
    'settings.language': 'Language',
    'settings.languageDesc': 'Select the interface language',
    'settings.timezone': 'Time Zone',
    'settings.timezoneDesc': 'Configure your local time zone',
    'settings.sidebarDefault': 'Sidebar Visible by Default',
    'settings.sidebarDefaultDesc': 'Show sidebar when loading the page',
    'settings.animations': 'Animations',
    'settings.animationsDesc': 'Enable transition animations',
    'settings.systemNotifications': 'System Notifications',
    'settings.systemNotificationsDesc': 'Receive notifications about updates',
    'settings.notificationSounds': 'Notification Sounds',
    'settings.notificationSoundsDesc': 'Play sounds for notifications',
    'settings.autosave': 'Auto-save',
    'settings.autosaveDesc': 'Automatically save settings',
    'settings.clearCache': 'Clear Cache Data',
    'settings.clearCacheDesc': 'Remove temporary browser data',
    'settings.about': 'About',
    'settings.aboutDesc': 'Information about World Explorer',
    'settings.help': 'Help & Documentation',
    'settings.helpDesc': 'Access guides and tutorials',
    'settings.enabled': 'Enabled',
    'settings.disabled': 'Disabled',
    'settings.viewInfo': 'View Information',
    'settings.openHelp': 'Open Help',
    'settings.clearCacheBtn': 'Clear Cache',

    // Checkout Page
    'checkout.title': 'Checkout',
    'checkout.subtitle': 'Complete your purchase',
    'checkout.backToMarketplace': 'Back to Marketplace',
    'checkout.emptyCart': 'Your cart is empty',
    'checkout.emptyCartDesc': 'Add some items to your cart before checking out.',
    'checkout.continueShopping': 'Continue Shopping',
    'checkout.orderSummary': 'Order Summary',
    'checkout.reviewItems': 'Review your items before checkout',
    'checkout.quantity': 'quantity',
    'checkout.remove': 'Remove',
    'checkout.shippingInfo': 'Shipping Information',
    'checkout.firstName': 'First Name',
    'checkout.lastName': 'Last Name',
    'checkout.email': 'Email',
    'checkout.phone': 'Phone',
    'checkout.address': 'Address',
    'checkout.city': 'City',
    'checkout.state': 'State',
    'checkout.zipCode': 'ZIP Code',
    'checkout.country': 'Country',
    'checkout.paymentInfo': 'Payment Information',
    'checkout.billingSameAsShipping': 'Billing address same as shipping',
    'checkout.paymentMethod': 'Payment Method',
    'checkout.creditDebitCard': 'Credit/Debit Card',
    'checkout.paypal': 'PayPal',
    'checkout.bankTransfer': 'Bank Transfer',
    'checkout.cardNumber': 'Card Number',
    'checkout.expiryDate': 'Expiry Date',
    'checkout.cvv': 'CVV',
    'checkout.orderSummaryTitle': 'Order Summary',
    'checkout.subtotal': 'Subtotal',
    'checkout.shipping': 'Shipping',
    'checkout.free': 'Free',
    'checkout.tax': 'Tax',
    'checkout.total': 'Total',
    'checkout.placeOrder': 'Place Order',
    'checkout.termsAgreement': 'By placing your order, you agree to our terms and conditions.',
    'checkout.secureCheckout': 'Secure Checkout',
    'checkout.secureCheckoutDesc': 'Your payment information is encrypted and secure. We use industry-standard SSL encryption.',
    'checkout.items': 'items',

    // Global Structure
    'globalStructure.title': 'Global Structure',
    'globalStructure.subtitle': 'Explore the complete Schema.org structure with all updated entities.',
    'globalStructure.explore': 'Explore',

    // Donations
    'donations.title': 'Donations by Love',
    'donations.subtitle': 'Manage donation campaigns and support important causes',
    'donations.search': 'Search',
    'donations.filter': 'Filter',
    'donations.newCampaign': 'New Campaign',
    'donations.statistics': 'Statistics',
    'donations.activeCampaigns': 'Active Campaigns',
    'donations.totalRaised': 'Total Raised',
    'donations.donors': 'Donors',
    'donations.goalAchieved': 'Goal Achieved',
    'donations.actions': 'Actions',
    'donations.createCampaign': 'Create Campaign',
    'donations.reports': 'Reports',
    'donations.manageDonors': 'Manage Donors',
    'donations.campaigns': 'Donation Campaigns',
    'donations.loadMore': 'Load More Campaigns',
    'donations.humanitarian': 'Humanitarian',
    'donations.education': 'Education',
    'donations.environment': 'Environment',
    'donations.health': 'Health',
    'donations.active': 'Active',
    'donations.paused': 'Paused',
    'donations.completed': 'Completed',
    'donations.cancelled': 'Cancelled',
    'donations.until': 'Until',

    // Common
    'common.back': 'Back',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.yes': 'Yes',
    'common.no': 'No',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.marketplace': 'Mercado',
    'nav.cart': 'Carrito',
    'nav.settings': 'Configuración',

    // Home/Timeline
    'home.liveUpdates': 'Actualizaciones en Vivo',
    'home.watching': 'Vigilando nuevas actualizaciones de Schema.org...',
    'home.noUpdatesFound': 'No se encontraron actualizaciones para',
    'home.tryDifferentEntity': 'Intenta seleccionar un tipo de entidad diferente o espera nuevas actualizaciones.',
    'home.showAllUpdates': 'Mostrar Todas las Actualizaciones',
    'home.live': 'En Vivo',

    // Marketplace
    'marketplace.title': 'Mercado Mercantia',
    'marketplace.discover': 'Descubrir & Conectar',
    'marketplace.search': 'Buscar productos, organizaciones, lugares...',
    'marketplace.organizations': 'Organizaciones',
    'marketplace.departments': 'Departamentos',
    'marketplace.products': 'Productos',
    'marketplace.totalItems': 'artículos totales en el mercado',
    'marketplace.searchFor': 'Buscar',
    'marketplace.organizationsTitle': 'Organizaciones',
    'marketplace.organizationsDesc': 'Descubra e conecte-se com empresas e organizações',
    'marketplace.departmentsTitle': 'Departamentos de Productos',
    'marketplace.departmentsDesc': 'Navega por productos por categoría y departamento',
    'marketplace.productsTitle': 'Productos',
    'marketplace.productsDesc': 'Navega y compra productos de nuestro marketplace',
    'marketplace.noOrganizations': 'No se encontraron organizaciones',
    'marketplace.noOrganizationsDesc': 'Las organizaciones aparecerán aquí cuando se registren en el sistema.',
    'marketplace.noDepartments': 'No se encontraron departamentos',
    'marketplace.noDepartmentsDesc': 'Los departamentos de productos aparecerán aquí cuando se registren productos.',
    'marketplace.noProducts': 'No se encontraron productos',
    'marketplace.noProductsDesc': 'Los productos aparecerán aquí cuando se registren en el sistema.',
    'marketplace.product': 'producto',
    'marketplace.products': 'productos',
    'marketplace.items': 'artículos',
    'marketplace.viewCart': 'Ver Carrito',

    // Cart
    'cart.addToCart': 'Agregar al Carrito',
    'cart.viewCart': 'Ver Carrito',
    'cart.quantity': 'cantidad',

    // Entity types
    'entity.person': 'Persona',
    'entity.organization': 'Organización',
    'entity.product': 'Producto',
    'entity.place': 'Lugar',

    // Actions
    'action.viewDetails': 'Ver Detalles',
    'action.loadMore': 'Cargar Más',
    'action.clearFilter': 'Limpiar Filtro',

    // Status
    'status.live': 'En Vivo',
    'status.loading': 'Cargando...',
    'status.noResults': 'No se encontraron resultados',

    // Categories
    'category.software': 'Software',
    'category.technology': 'Tecnología',
    'category.company': 'Empresa',

    // Organization Page
    'organization.about': 'Acerca de',
    'organization.departments': 'Departamentos',
    'organization.products': 'Productos',
    'organization.location': 'Ubicación',
    'organization.founded': 'Fundada en',
    'organization.visitWebsite': 'Visitar Sitio Web',
    'organization.noDescription': 'No hay descripción disponible.',
    'organization.noDepartments': 'No se encontraron departamentos.',
    'organization.noProducts': 'No se encontraron productos.',
    'organization.moreProducts': 'Y más productos...',
    'organization.loading': 'Cargando organización...',
    'organization.notFound': 'Organización No Encontrada',
    'organization.notFoundDesc': 'La organización que buscas no existe.',
    'organization.goBack': 'Volver',
    'organization.backToMarketplace': 'Volver al Mercado',

    // Product Page
    'product.productImage': 'Imagen del Producto',
    'product.description': 'Descripción',
    'product.specifications': 'Especificaciones',
    'product.category': 'Categoría',
    'product.type': 'Tipo',
    'product.price': 'Precio',
    'product.id': 'ID',
    'product.purchaseSection': 'Sección de Compra',
    'product.freeShipping': 'Envío gratis en pedidos superiores a $50',
    'product.department': 'Departamento',
    'product.manufacturer': 'Fabricante',
    'product.productCategory': 'Categoría del Producto',
    'product.browseMore': 'Navega por más productos en esta categoría.',
    'product.customerReviews': 'Reseñas de Clientes',
    'product.outOfStars': 'de 5 estrellas',
    'product.basedOnReviews': 'Basado en reseñas de clientes',
    'product.noImage': 'No hay imagen disponible',
    'product.loading': 'Cargando producto...',
    'product.notFound': 'Producto No Encontrado',
    'product.notFoundDesc': 'El producto que buscas no existe.',
    'product.goBack': 'Volver',
    'product.backToMarketplace': 'Volver al Mercado',
    'product.viewDetails': 'Ver Detalles',
    'product.addToCart': 'Agregar al Carrito',

    // Department Page
    'department.products': 'Productos',
    'department.organization': 'Organización',
    'department.departmentStats': 'Estadísticas del Departamento',
    'department.noProducts': 'No se encontraron productos',
    'department.noProductsDesc': 'Este departamento aún no tiene productos.',
    'department.loading': 'Cargando departamento...',
    'department.backToMarketplace': 'Volver al Mercado',
    'department.badge': 'Departamento',
    'department.priceRange': 'Rango de Precios',
    'department.totalValue': 'Valor Total',
    'department.addToCart': 'Agregar al Carrito',
    'department.viewDetails': 'Ver Detalles',

    // Home Page Mini-cards
    'home.role': 'Rol',
    'home.company': 'Empresa',
    'home.contact': 'Contacto',
    'home.type': 'Tipo',
    'home.founded': 'Fundada',
    'home.website': 'Sitio Web',
    'home.price': 'Precio',
    'home.category': 'Categoría',
    'home.brand': 'Marca',
    'home.product': 'Producto',
    'home.organization': 'Organización',
    'home.person': 'Persona',

    // Sidebar
    'sidebar.current': 'Actual:',
    'sidebar.selected': 'Seleccionado:',
    'sidebar.loadingSchema': 'Cargando entidades de Schema.org...',
    'sidebar.failedToLoad': 'Error al cargar entidades de schema',
    'sidebar.retry': 'Reintentar',
    'sidebar.searchEntities': 'Buscar entidades...',
    'sidebar.entitiesLoaded': 'entidades cargadas',
    'sidebar.matching': 'coincidentes',
    'sidebar.noEntitiesFound': 'No se encontraron entidades que coincidan con',
    'sidebar.subtypes': 'subtipos',
    'sidebar.abstract': 'abstracto',

    // Settings Page
    'settings.title': 'Configuración',
    'settings.subtitle': 'Personaliza tu experiencia en Schema Explorer',
    'settings.appearance': 'Apariencia',
    'settings.languageRegion': 'Idioma y Región',
    'settings.navigation': 'Navegación',
    'settings.notifications': 'Notificaciones',
    'settings.dataPrivacy': 'Datos y Privacidad',
    'settings.support': 'Soporte',
    'settings.manageSettings': 'Administrar configuración',
    'settings.theme': 'Tema',
    'settings.themeDesc': 'Elige entre tema claro, oscuro o automático',
    'settings.language': 'Idioma',
    'settings.languageDesc': 'Selecciona el idioma de la interfaz',
    'settings.timezone': 'Zona Horaria',
    'settings.timezoneDesc': 'Configura tu zona horaria local',
    'settings.sidebarDefault': 'Barra Lateral Visible por Defecto',
    'settings.sidebarDefaultDesc': 'Mostrar barra lateral al cargar la página',
    'settings.animations': 'Animaciones',
    'settings.animationsDesc': 'Habilitar animaciones de transición',
    'settings.systemNotifications': 'Notificaciones del Sistema',
    'settings.systemNotificationsDesc': 'Recibir notificaciones sobre actualizaciones',
    'settings.notificationSounds': 'Sonidos de Notificación',
    'settings.notificationSoundsDesc': 'Reproducir sonidos para notificaciones',
    'settings.autosave': 'Auto-guardado',
    'settings.autosaveDesc': 'Guardar automáticamente la configuración',
    'settings.clearCache': 'Limpiar Datos de Caché',
    'settings.clearCacheDesc': 'Eliminar datos temporales del navegador',
    'settings.about': 'Acerca de',
    'settings.aboutDesc': 'Información sobre World Explorer',
    'settings.help': 'Ayuda y Documentación',
    'settings.helpDesc': 'Acceder a guías y tutoriales',
    'settings.enabled': 'Habilitado',
    'settings.disabled': 'Deshabilitado',
    'settings.viewInfo': 'Ver Información',
    'settings.openHelp': 'Abrir Ayuda',
    'settings.clearCacheBtn': 'Limpiar Caché',

    // Checkout Page
    'checkout.title': 'Finalizar Compra',
    'checkout.subtitle': 'Complete su compra',
    'checkout.backToMarketplace': 'Volver al Mercado',
    'checkout.emptyCart': 'Su carrito está vacío',
    'checkout.emptyCartDesc': 'Agregue algunos artículos a su carrito antes de finalizar la compra.',
    'checkout.continueShopping': 'Continuar Comprando',
    'checkout.orderSummary': 'Resumen del Pedido',
    'checkout.reviewItems': 'Revise sus artículos antes de finalizar',
    'checkout.quantity': 'cantidad',
    'checkout.remove': 'Eliminar',
    'checkout.shippingInfo': 'Información de Envío',
    'checkout.firstName': 'Nombre',
    'checkout.lastName': 'Apellido',
    'checkout.email': 'Correo Electrónico',
    'checkout.phone': 'Teléfono',
    'checkout.address': 'Dirección',
    'checkout.city': 'Ciudad',
    'checkout.state': 'Estado',
    'checkout.zipCode': 'Código Postal',
    'checkout.country': 'País',
    'checkout.paymentInfo': 'Información de Pago',
    'checkout.billingSameAsShipping': 'Dirección de facturación igual a la de envío',
    'checkout.paymentMethod': 'Método de Pago',
    'checkout.creditDebitCard': 'Tarjeta de Crédito/Débito',
    'checkout.paypal': 'PayPal',
    'checkout.bankTransfer': 'Transferencia Bancaria',
    'checkout.cardNumber': 'Número de Tarjeta',
    'checkout.expiryDate': 'Fecha de Vencimiento',
    'checkout.cvv': 'CVV',
    'checkout.orderSummaryTitle': 'Resumen del Pedido',
    'checkout.subtotal': 'Subtotal',
    'checkout.shipping': 'Envío',
    'checkout.free': 'Gratis',
    'checkout.tax': 'Impuesto',
    'checkout.total': 'Total',
    'checkout.placeOrder': 'Realizar Pedido',
    'checkout.termsAgreement': 'Al realizar su pedido, acepta nuestros términos y condiciones.',
    'checkout.secureCheckout': 'Compra Segura',
    'checkout.secureCheckoutDesc': 'Su información de pago está encriptada y segura. Utilizamos encriptación SSL estándar de la industria.',
    'checkout.items': 'artículos',

    // Global Structure
    'globalStructure.title': 'Estructura Global',
    'globalStructure.subtitle': 'Explora la estructura completa de Schema.org con todas las entidades actualizadas.',
    'globalStructure.explore': 'Explorar',

    // Donations
    'donations.title': 'Donaciones por Amor',
    'donations.subtitle': 'Gestiona campañas de donación y apoya causas importantes',
    'donations.search': 'Buscar',
    'donations.filter': 'Filtrar',
    'donations.newCampaign': 'Nueva Campaña',
    'donations.statistics': 'Estadísticas',
    'donations.activeCampaigns': 'Campañas Activas',
    'donations.totalRaised': 'Total Recaudado',
    'donations.donors': 'Donantes',
    'donations.goalAchieved': 'Meta Alcanzada',
    'donations.actions': 'Acciones',
    'donations.createCampaign': 'Crear Campaña',
    'donations.reports': 'Reportes',
    'donations.manageDonors': 'Gestionar Donantes',
    'donations.campaigns': 'Campañas de Donación',
    'donations.loadMore': 'Cargar Más Campañas',
    'donations.humanitarian': 'Humanitaria',
    'donations.education': 'Educación',
    'donations.environment': 'Medio Ambiente',
    'donations.health': 'Salud',
    'donations.active': 'Activa',
    'donations.paused': 'Pausada',
    'donations.completed': 'Completada',
    'donations.cancelled': 'Cancelada',
    'donations.until': 'Hasta',

    // Common
    'common.back': 'Atrás',
    'common.close': 'Cerrar',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.yes': 'Sí',
    'common.no': 'No',
  },
};

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  // Load language from localStorage on mount
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && ['pt', 'en', 'es'].includes(savedLanguage)) {
        console.log('Loading saved language:', savedLanguage);
        setLanguage(savedLanguage);
      } else {
        // Detect browser language
        const browserLang = navigator.language.split('-')[0] as Language;
        if (['pt', 'en', 'es'].includes(browserLang)) {
          console.log('Using browser language:', browserLang);
          setLanguage(browserLang);
        } else {
          console.log('Using default language: pt');
        }
      }
    } catch (error) {
      console.error('Error loading language from localStorage:', error);
    }
  }, []);

  // Save language to localStorage when changed
  useEffect(() => {
    try {
      console.log('Saving language to localStorage:', language);
      localStorage.setItem('language', language);
    } catch (error) {
      console.error('Error saving language to localStorage:', error);
    }
  }, [language]);

  const t = (key: string, defaultValue?: string): string => {
    try {
      // Hardcoded translations for home keys
      if (key === 'home.live') return language === 'en' ? 'Live' : 'Ao Vivo';

      // Hardcoded translations for marketplace keys
      if (key === 'marketplace.organizationsTitle') return language === 'en' ? 'Organizations' : 'Organizações';
      if (key === 'marketplace.organizationsDesc') {
        if (language === 'en') return 'Discover and connect with companies and organizations';
        if (language === 'es') return 'Descubre y conecta con empresas y organizaciones';
        return 'Descubra e conecte-se com empresas e organizações';
      }
      if (key === 'marketplace.departmentsTitle') return language === 'en' ? 'Departments' : 'Departamentos';
      if (key === 'marketplace.departmentsDesc') {
        if (language === 'en') return 'Browse products by category and department';
        if (language === 'es') return 'Navega por productos por categoría y departamento';
        return 'Navegue por produtos por categoria e departamento';
      }
      if (key === 'marketplace.productsTitle') return language === 'en' ? 'Products' : 'Produtos';
      if (key === 'marketplace.productsDesc') {
        if (language === 'en') return 'Browse and purchase products from our marketplace';
        if (language === 'es') return 'Navega y compra productos de nuestro marketplace';
        return 'Navegue e compre produtos do nosso marketplace';
      }

      // Hardcoded English translations for department keys
      if (key === 'department.backToMarketplace') return 'Back to Marketplace';
      if (key === 'department.badge') return 'Department';
      if (key === 'department.products') return 'Products';
      if (key === 'department.addToCart') return 'Add to Cart';
      if (key === 'department.organization') return 'Organization';
      if (key === 'department.departmentStats') return 'Department Statistics';
      if (key === 'department.priceRange') return 'Price Range';
      if (key === 'department.totalValue') return 'Total Value';
      if (key === 'department.loading') return 'Loading department...';
      if (key === 'department.viewDetails') return 'View Details';

      const langTranslations = translations[language];
      if (langTranslations && langTranslations[key]) {
        return langTranslations[key];
      }
      // Fallback to Portuguese only if language is not English
      if (language !== 'en') {
        const ptTranslations = translations['pt'];
        if (ptTranslations && ptTranslations[key]) {
          return ptTranslations[key];
        }
      }
      return defaultValue || key;
    } catch (error) {
      console.error('Translation error:', error);
      return defaultValue || key;
    }
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
