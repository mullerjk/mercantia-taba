"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BorderBeam } from "@/components/ui/border-beam"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Package,
  Building2,
  MapPin,
  Calendar,
  Shield,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Hash,
  Image as ImageIcon
} from "lucide-react"
import type { Entity, Verification, Relation, Proof } from "@/types/knowledge-graph"

interface EntityViewerProps {
  entity: Entity
  relations?: Relation[]
  className?: string
}

export function EntityViewer({ entity, relations = [], className }: EntityViewerProps) {
  
  const getEntityIcon = (type: string) => {
    switch (type) {
      case "Person": return <User className="size-5" />
      case "Product": return <Package className="size-5" />
      case "Organization": return <Building2 className="size-5" />
      case "Place": return <MapPin className="size-5" />
      default: return <Hash className="size-5" />
    }
  }

  const getTrustScoreColor = (score: number = 0) => {
    if (score >= 80) return "text-green-500"
    if (score >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={className}>
      {/* Main Entity Card */}
      <Card className="relative overflow-hidden">
        <BorderBeam size={250} duration={12} delay={9} />
        
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Avatar/Icon */}
              <Avatar className="size-16">
                <AvatarImage src={entity.properties.image as string} />
                <AvatarFallback className="bg-primary/10">
                  {getEntityIcon(entity.type)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">
                    {entity.properties.name as string || 'Unnamed Entity'}
                  </CardTitle>
                  <Badge variant="secondary">{entity.type}</Badge>
                </div>
                
                {entity.properties.description && (
                  <CardDescription className="text-base">
                    {entity.properties.description as string}
                  </CardDescription>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Hash className="size-3" />
                    <code className="text-xs">{entity.id.split(':').pop()?.substring(0, 8)}...</code>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {formatDate(entity.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Score */}
            {entity.trustScore !== undefined && (
              <div className="text-center">
                <div className={`text-3xl font-bold ${getTrustScoreColor(entity.trustScore)}`}>
                  {entity.trustScore}%
                </div>
                <div className="text-xs text-muted-foreground">Confiança</div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Properties */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Package className="size-4" />
              Propriedades
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(entity.properties).map(([key, value]) => {
                if (key === 'name' || key === 'description' || key === 'image') return null
                
                return (
                  <div key={key} className="flex flex-col gap-1 p-3 bg-muted/50 rounded-lg">
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                      {key}
                    </span>
                    <span className="text-sm">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Verifications */}
          {entity.verifications && entity.verifications.length > 0 && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Shield className="size-4" />
                  Verificações
                  <Badge variant="outline" className="ml-auto">
                    {entity.verifications.length} verificação(ões)
                  </Badge>
                </h3>
                <div className="space-y-2">
                  {entity.verifications.map((verification, index) => (
                    <VerificationCard key={index} verification={verification} />
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Relations */}
          {relations && relations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <ExternalLink className="size-4" />
                Relações
                <Badge variant="outline" className="ml-auto">
                  {relations.length} relação(ões)
                </Badge>
              </h3>
              <div className="space-y-2">
                {relations.map((relation) => (
                  <RelationCard key={relation.id} relation={relation} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Verification Card Component
function VerificationCard({ verification }: { verification: Verification }) {
  const isExpired = verification.expiresAt && new Date(verification.expiresAt) < new Date()

  return (
    <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
      <div className="flex items-center gap-3">
        {isExpired ? (
          <AlertCircle className="size-5 text-destructive" />
        ) : (
          <CheckCircle className="size-5 text-green-500" />
        )}
        <div>
          <div className="font-medium text-sm capitalize">
            {verification.method.replace(/_/g, ' ')}
          </div>
          <div className="text-xs text-muted-foreground">
            Verificado por {verification.verifiedBy}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-muted-foreground">
          {new Date(verification.timestamp).toLocaleDateString('pt-BR')}
        </div>
        {verification.expiresAt && (
          <div className={`text-xs ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`}>
            {isExpired ? 'Expirado' : `Expira em ${new Date(verification.expiresAt).toLocaleDateString('pt-BR')}`}
          </div>
        )}
      </div>
    </div>
  )
}

// Relation Card Component
function RelationCard({ relation }: { relation: Relation }) {
  return (
    <div className="p-4 bg-card border rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="default">{relation.type}</Badge>
          {relation.trustScore !== undefined && (
            <Badge variant="outline">
              {relation.trustScore}% confiança
            </Badge>
          )}
        </div>
        {relation.startTime && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {new Date(relation.startTime).toLocaleDateString('pt-BR')}
          </div>
        )}
      </div>

      {/* Proofs */}
      {relation.proofs && relation.proofs.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Provas:</div>
          <div className="flex flex-wrap gap-2">
            {relation.proofs.map((proof, index) => (
              <ProofBadge key={index} proof={proof} />
            ))}
          </div>
        </div>
      )}

      {/* Witnesses */}
      {relation.witnesses && relation.witnesses.length > 0 && (
        <div className="text-xs text-muted-foreground">
          👥 {relation.witnesses.length} testemunha(s)
        </div>
      )}
    </div>
  )
}

// Proof Badge Component
function ProofBadge({ proof }: { proof: Proof }) {
  const getProofIcon = (type: string) => {
    switch (type) {
      case "photo": return <ImageIcon className="size-3" />
      case "receipt": return <ExternalLink className="size-3" />
      case "document": return <ExternalLink className="size-3" />
      case "blockchain": return <Shield className="size-3" />
      default: return <Hash className="size-3" />
    }
  }

  return (
    <Badge variant="secondary" className="gap-1">
      {getProofIcon(proof.type)}
      {proof.type}
      {proof.verifiedBy && <CheckCircle className="size-3 text-green-500" />}
    </Badge>
  )
}
