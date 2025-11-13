"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { GlobalSidebar } from "@/components/global-sidebar";
import { DockNavigation } from "@/components/dock-navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Calendar, Globe, Star, Building2 } from "lucide-react";
import Link from "next/link";

interface PersonData {
  id: string;
  name: string;
  description: string;
  schema_type: string;
  properties: {
    email?: string;
    telephone?: string;
    address?: string;
    jobTitle?: string;
    worksFor?: string;
    birthDate?: string;
    givenName?: string;
    familyName?: string;
    gender?: string;
    knowsAbout?: string[];
  };
  created_at: string;
}

export default function PersonPage() {
  const params = useParams();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [person, setPerson] = useState<PersonData | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleRouteChange = (route: string) => {
    console.log("Route change:", route);
  };

  const handleEntitySelect = (entityName: string) => {
    console.log("Entity selected:", entityName);
  };

  useEffect(() => {
    const fetchPersonData = async () => {
      if (!params.id) return;

      try {
        setLoading(true);

        // Fetch person details
        const personResponse = await fetch(`/api/entities?type=schema:Person`);
        if (personResponse.ok) {
          const persons = await personResponse.json();
          const foundPerson = persons.find((p: PersonData) => p.id === params.id);
          setPerson(foundPerson || null);
        }

      } catch (error) {
        console.error('Error fetching person data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading person...</p>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-2xl font-bold mb-2">Person Not Found</h1>
          <p className="text-muted-foreground mb-4">The person you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="relative w-full p-8 pb-4">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Timeline
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{person.name}</h1>
              <Badge className="mt-2">Person</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Person Details */}
      <div className="w-full px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <p className="text-gray-600 mb-6">
                  {person.properties.description || person.description || 'No description available.'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {person.properties.givenName && person.properties.familyName && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{person.properties.givenName} {person.properties.familyName}</span>
                    </div>
                  )}

                  {person.properties.birthDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Born: {person.properties.birthDate}</span>
                    </div>
                  )}

                  {person.properties.gender && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="capitalize">{person.properties.gender}</span>
                    </div>
                  )}

                  {person.properties.jobTitle && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span>{person.properties.jobTitle}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills/Interests */}
              {person.properties.knowsAbout && person.properties.knowsAbout.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Skills & Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {person.properties.knowsAbout.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-600" />
                  Contact
                </h3>

                <div className="space-y-3">
                  {person.properties.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{person.properties.email}</span>
                    </div>
                  )}

                  {person.properties.telephone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{person.properties.telephone}</span>
                    </div>
                  )}

                  {person.properties.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{person.properties.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Work Information */}
              {person.properties.worksFor && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-600" />
                    Work
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{person.properties.worksFor}</span>
                    </div>

                    {person.properties.jobTitle && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{person.properties.jobTitle}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Person Stats */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Profile Stats</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="text-sm font-medium">
                      {new Date(person.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Type</span>
                    <Badge variant="secondary">Person</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Skills</span>
                    <span className="text-sm font-medium">
                      {person.properties.knowsAbout?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
