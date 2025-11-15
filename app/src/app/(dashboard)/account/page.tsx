'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PersonSchema, PostalAddress } from '@/types/person'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AlertCircle, CheckCircle2, Loader2, User, MapPin, Briefcase, Globe, Users, Shield } from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState<Partial<PersonSchema>>({
    '@type': 'Person',
    name: '',
    givenName: '',
    familyName: '',
    email: '',
    telephone: '',
    description: '',
    jobTitle: '',
    url: '',
    image: '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '',
      addressLocality: '',
      addressRegion: '',
      postalCode: '',
      addressCountry: '',
    },
  })

  useEffect(() => {
    loadUserProfile()
  }, [])

  async function loadUserProfile() {
    try {
      // Get authenticated user
      const response = await fetch('/api/auth/verify', {
        credentials: 'include',
      })

      if (!response.ok) {
        router.push('/auth/login')
        return
      }

      const { user } = await response.json()
      setUser(user)

      // Load person entity if exists
      // For now, use user data
      setFormData(prev => ({
        ...prev,
        name: user.fullName || '',
        email: user.email || '',
        image: user.avatarUrl || '',
      }))

      setLoading(false)
    } catch (error) {
      console.error('Error loading profile:', error)
      setMessage({ type: 'error', text: 'Failed to load profile' })
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' })

      // Reload profile
      await loadUserProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  function updateField(field: string, value: any) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function updateNestedField(parent: string, field: string, value: any) {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...((prev as any)[parent] || {}),
        [field]: value,
      },
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-20 h-20">
          <AvatarImage src={formData.image as string} alt={formData.name} />
          <AvatarFallback>
            <User className="w-10 h-10" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic">
              <User className="w-4 h-4 mr-2" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="contact">
              <MapPin className="w-4 h-4 mr-2" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="professional">
              <Briefcase className="w-4 h-4 mr-2" />
              Professional
            </TabsTrigger>
            <TabsTrigger value="social">
              <Globe className="w-4 h-4 mr-2" />
              Social
            </TabsTrigger>
            <TabsTrigger value="personal">
              <Users className="w-4 h-4 mr-2" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* BASIC INFORMATION */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your personal details and identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="givenName">First Name</Label>
                    <Input
                      id="givenName"
                      value={formData.givenName || ''}
                      onChange={(e) => updateField('givenName', e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="familyName">Last Name</Label>
                    <Input
                      id="familyName"
                      value={formData.familyName || ''}
                      onChange={(e) => updateField('familyName', e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name (Display Name)</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="additionalName">Middle Name</Label>
                    <Input
                      id="additionalName"
                      value={formData.additionalName || ''}
                      onChange={(e) => updateField('additionalName', e.target.value)}
                      placeholder="Michael"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alternateName">Nickname</Label>
                    <Input
                      id="alternateName"
                      value={formData.alternateName || ''}
                      onChange={(e) => updateField('alternateName', e.target.value)}
                      placeholder="Johnny"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="honorificPrefix">Title/Prefix</Label>
                    <Input
                      id="honorificPrefix"
                      value={formData.honorificPrefix || ''}
                      onChange={(e) => updateField('honorificPrefix', e.target.value)}
                      placeholder="Dr., Mr., Mrs."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="honorificSuffix">Suffix</Label>
                    <Input
                      id="honorificSuffix"
                      value={formData.honorificSuffix || ''}
                      onChange={(e) => updateField('honorificSuffix', e.target.value)}
                      placeholder="Jr., Sr., PhD"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Input
                      id="gender"
                      value={formData.gender || ''}
                      onChange={(e) => updateField('gender', e.target.value)}
                      placeholder="Male, Female, Other"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate || ''}
                      onChange={(e) => updateField('birthDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Bio / Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Profile Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    value={typeof formData.image === 'string' ? formData.image : ''}
                    onChange={(e) => updateField('image', e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONTACT & ADDRESS */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How people can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Phone</Label>
                    <Input
                      id="telephone"
                      type="tel"
                      value={formData.telephone || ''}
                      onChange={(e) => updateField('telephone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="faxNumber">Fax Number (Optional)</Label>
                  <Input
                    id="faxNumber"
                    type="tel"
                    value={formData.faxNumber || ''}
                    onChange={(e) => updateField('faxNumber', e.target.value)}
                    placeholder="+1 (555) 123-4568"
                  />
                </div>

                <Separator className="my-6" />

                <h3 className="text-lg font-semibold">Address</h3>

                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Street Address</Label>
                  <Input
                    id="streetAddress"
                    value={(formData.address as PostalAddress)?.streetAddress || ''}
                    onChange={(e) => updateNestedField('address', 'streetAddress', e.target.value)}
                    placeholder="123 Main St, Apt 4B"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressLocality">City</Label>
                    <Input
                      id="addressLocality"
                      value={(formData.address as PostalAddress)?.addressLocality || ''}
                      onChange={(e) => updateNestedField('address', 'addressLocality', e.target.value)}
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressRegion">State/Province</Label>
                    <Input
                      id="addressRegion"
                      value={(formData.address as PostalAddress)?.addressRegion || ''}
                      onChange={(e) => updateNestedField('address', 'addressRegion', e.target.value)}
                      placeholder="NY"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={(formData.address as PostalAddress)?.postalCode || ''}
                      onChange={(e) => updateNestedField('address', 'postalCode', e.target.value)}
                      placeholder="10001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressCountry">Country</Label>
                    <Input
                      id="addressCountry"
                      value={(formData.address as PostalAddress)?.addressCountry || ''}
                      onChange={(e) => updateNestedField('address', 'addressCountry', e.target.value)}
                      placeholder="United States"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROFESSIONAL */}
          <TabsContent value="professional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>Your career and work details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle || ''}
                    onChange={(e) => updateField('jobTitle', e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="worksFor">Company/Organization</Label>
                  <Input
                    id="worksFor"
                    value={typeof formData.worksFor === 'object' ? (formData.worksFor as any)?.name : ''}
                    onChange={(e) => updateField('worksFor', { '@type': 'Organization', name: e.target.value })}
                    placeholder="Acme Corporation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="award">Awards & Achievements (comma-separated)</Label>
                  <Textarea
                    id="award"
                    value={formData.award?.join(', ') || ''}
                    onChange={(e) => updateField('award', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    placeholder="Employee of the Year 2023, Innovation Award 2022"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SOCIAL */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social & Web Presence</CardTitle>
                <CardDescription>Your online profiles and connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Personal Website</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url || ''}
                    onChange={(e) => updateField('url', e.target.value)}
                    placeholder="https://johndoe.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sameAs">Social Media Links (one per line)</Label>
                  <Textarea
                    id="sameAs"
                    value={formData.sameAs?.join('\n') || ''}
                    onChange={(e) => updateField('sameAs', e.target.value.split('\n').filter(Boolean))}
                    placeholder="https://twitter.com/johndoe&#10;https://linkedin.com/in/johndoe&#10;https://github.com/johndoe"
                    rows={5}
                  />
                  <p className="text-sm text-muted-foreground">
                    Add links to your Twitter, LinkedIn, GitHub, etc.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PERSONAL */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>Additional personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={typeof formData.nationality === 'object' ? (formData.nationality as any)?.name : ''}
                    onChange={(e) => updateField('nationality', { '@type': 'Country', name: e.target.value })}
                    placeholder="United States"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      value={typeof formData.height === 'string' ? formData.height : ''}
                      onChange={(e) => updateField('height', e.target.value)}
                      placeholder="180 cm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      value={typeof formData.weight === 'string' ? formData.weight : ''}
                      onChange={(e) => updateField('weight', e.target.value)}
                      placeholder="75 kg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxID">Tax ID (Optional)</Label>
                  <Input
                    id="taxID"
                    value={formData.taxID || ''}
                    onChange={(e) => updateField('taxID', e.target.value)}
                    placeholder="XXX-XX-XXXX"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECURITY */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security & Privacy</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Account Status</h4>
                  <div className="space-y-1 text-sm">
                    <p>Email: <span className="font-mono">{user?.email}</span></p>
                    <p>Role: <span className="capitalize">{user?.role}</span></p>
                    <p>Verified: {user?.emailVerified ? '✓ Yes' : '✗ No'}</p>
                  </div>
                </div>

                <Button type="button" variant="outline" className="w-full">
                  Change Password
                </Button>

                <Button type="button" variant="outline" className="w-full">
                  Enable Two-Factor Authentication
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" variant="outline" onClick={() => router.push('/')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
