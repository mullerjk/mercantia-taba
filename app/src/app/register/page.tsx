"use client";

import { useState } from "react";
import { GlobalSidebar } from "@/components/global-sidebar";
import { DockNavigation } from "@/components/dock-navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building2, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Register() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("person");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleRouteChange = (route: string) => {
    console.log("Route change:", route);
  };

  const handleEntitySelect = (entityName: string) => {
    console.log("Entity selected in register:", entityName);
  };

  const handlePersonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const personData = {
      type: 'person',
      givenName: formData.get('givenName'),
      familyName: formData.get('familyName'),
      email: formData.get('email'),
      telephone: formData.get('telephone'),
      address: formData.get('address'),
      birthDate: formData.get('birthDate'),
      gender: formData.get('gender'),
      jobTitle: formData.get('jobTitle'),
      worksFor: formData.get('worksFor'),
      schema_type: 'schema:Person'
    };

    try {
      const response = await fetch('/api/entities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personData),
      });

      if (response.ok) {
        const savedEntity = await response.json();
        console.log('Person saved successfully:', savedEntity);
        alert('Pessoa registrada com sucesso! Dados salvos no banco de dados.');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar pessoa');
      }

      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error registering person:', error);
      alert(`Erro ao registrar pessoa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const orgData = {
      type: 'organization',
      name: formData.get('orgName'),
      description: formData.get('orgDescription'),
      url: formData.get('orgUrl'),
      logo: formData.get('orgLogo'),
      foundingDate: formData.get('foundingDate'),
      address: formData.get('orgAddress'),
      contactPoint: formData.get('contactPoint'),
      orgType: formData.get('orgType'),
      schema_type: 'schema:Organization'
    };

    try {
      const response = await fetch('/api/entities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orgData),
      });

      if (response.ok) {
        const savedEntity = await response.json();
        console.log('Organization saved successfully:', savedEntity);
        alert('Organização registrada com sucesso! Dados salvos no banco de dados.');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar organização');
      }

      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error registering organization:', error);
      alert(`Erro ao registrar organização: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const productData = {
      type: 'product',
      name: formData.get('productName'),
      description: formData.get('productDescription'),
      price: parseFloat(formData.get('price') as string) || null,
      category: formData.get('category'),
      brand: formData.get('brand'),
      color: formData.get('color'),
      model: formData.get('model'),
      manufacturer: formData.get('manufacturer'),
      imageUrl: formData.get('imageUrl'),
      schema_type: 'schema:Product'
    };

    try {
      const response = await fetch('/api/entities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const savedEntity = await response.json();
        console.log('Product saved successfully:', savedEntity);
        alert('Produto registrado com sucesso! Dados salvos no banco de dados.');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar produto');
      }

      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error registering product:', error);
      alert(`Erro ao registrar produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const PersonForm = () => (
    <form onSubmit={handlePersonSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Register Person
          </CardTitle>
          <CardDescription>
            Create a new person profile with Schema.org structured data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="givenName">First Name</Label>
              <Input id="givenName" name="givenName" placeholder="John" required />
            </div>
            <div>
              <Label htmlFor="familyName">Last Name</Label>
              <Input id="familyName" name="familyName" placeholder="Doe" required />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
          </div>

          <div>
            <Label htmlFor="telephone">Phone</Label>
            <Input id="telephone" name="telephone" placeholder="+1 (555) 123-4567" />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <textarea
              id="address"
              name="address"
              placeholder="123 Main St, City, State, ZIP"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input id="birthDate" name="birthDate" type="date" />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input id="jobTitle" name="jobTitle" placeholder="Software Engineer" />
          </div>

          <div>
            <Label htmlFor="worksFor">Organization</Label>
            <Input id="worksFor" name="worksFor" placeholder="Company Name" />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register Person'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );

  const OrganizationForm = () => (
    <form onSubmit={handleOrganizationSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Register Organization
          </CardTitle>
          <CardDescription>
            Create a new organization profile with Schema.org structured data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="orgName">Organization Name</Label>
            <Input id="orgName" name="orgName" placeholder="Acme Corporation" required />
          </div>

          <div>
            <Label htmlFor="orgDescription">Description</Label>
            <textarea
              id="orgDescription"
              name="orgDescription"
              placeholder="Brief description of the organization"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div>
            <Label htmlFor="orgUrl">Website</Label>
            <Input id="orgUrl" name="orgUrl" type="url" placeholder="https://example.com" />
          </div>

          <div>
            <Label htmlFor="orgLogo">Logo URL</Label>
            <Input id="orgLogo" name="orgLogo" type="url" placeholder="https://example.com/logo.png" />
          </div>

          <div>
            <Label htmlFor="foundingDate">Founding Date</Label>
            <Input id="foundingDate" name="foundingDate" type="date" />
          </div>

          <div>
            <Label htmlFor="orgAddress">Address</Label>
            <textarea
              id="orgAddress"
              name="orgAddress"
              placeholder="123 Business St, City, State, ZIP"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPoint">Contact Email</Label>
              <Input id="contactPoint" name="contactPoint" type="email" placeholder="contact@example.com" />
            </div>
            <div>
              <Label htmlFor="orgType">Organization Type</Label>
              <select
                id="orgType"
                name="orgType"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select type</option>
                <option value="Corporation">Corporation</option>
                <option value="LocalBusiness">Local Business</option>
                <option value="GovernmentOrganization">Government</option>
                <option value="EducationalOrganization">Educational</option>
                <option value="NGO">NGO</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register Organization'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );

  const ProductForm = () => (
    <form onSubmit={handleProductSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Register Product
          </CardTitle>
          <CardDescription>
            Create a new product listing with Schema.org structured data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="productName">Product Name</Label>
            <Input id="productName" name="productName" placeholder="Wireless Headphones" required />
          </div>

          <div>
            <Label htmlFor="productDescription">Description</Label>
            <textarea
              id="productDescription"
              name="productDescription"
              placeholder="Detailed product description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" name="price" type="number" step="0.01" placeholder="199.99" />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Sports">Sports</option>
                <option value="Books">Books</option>
                <option value="Food">Food & Beverage</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" name="brand" placeholder="Brand Name" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="color">Color</Label>
              <Input id="color" name="color" placeholder="Black" />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" placeholder="Model Number" />
            </div>
          </div>

          <div>
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input id="manufacturer" name="manufacturer" placeholder="Manufacturer Name" />
          </div>

          <div>
            <Label htmlFor="imageUrl">Product Image URL</Label>
            <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://example.com/image.jpg" />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register Product'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="relative w-full p-8 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/marketplace">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Marketplace
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Register New Entity</h1>
              <p className="text-muted-foreground">Create persons, organizations, or products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Forms */}
      <div className="w-full px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="person" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="person" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Person
              </TabsTrigger>
              <TabsTrigger value="organization" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Organization
              </TabsTrigger>
              <TabsTrigger value="product" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Product
              </TabsTrigger>
            </TabsList>

            <TabsContent value="person" className="mt-6">
              <PersonForm />
            </TabsContent>

            <TabsContent value="organization" className="mt-6">
              <OrganizationForm />
            </TabsContent>

            <TabsContent value="product" className="mt-6">
              <ProductForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Global Sidebar Overlay */}
      <GlobalSidebar
        isVisible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onRouteChange={handleRouteChange}
        onEntitySelect={handleEntitySelect}
      />

      {/* Dock Navigation */}
      <DockNavigation
        showSidebar={showSidebar}
        onToggleSidebar={toggleSidebar}
      />
    </div>
  );
}
