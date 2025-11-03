"use client"

import { useParams, useRouter } from "next/navigation"
import { SchemaEntityDetails } from "@/components/schema-entity-details"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function SchemaTypePage() {
  const params = useParams()
  const router = useRouter()
  const typeName = params.type as string

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>

        {/* Schema Entity Details */}
        <SchemaEntityDetails
          entityId={`schema:${typeName}`}
          entityName={typeName}
        />
      </div>
    </div>
  )
}
