'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, Copy, Loader2, CheckCircle, Download } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'

interface BoletoFormProps {
  total: number
  orderId?: string
  customerId?: string
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
  loading?: boolean
}

export function BoletoForm({
  total,
  orderId,
  customerId,
  onSuccess,
  onError,
  loading = false,
}: BoletoFormProps) {
  const [processing, setProcessing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [boletoData, setBoletoData] = useState<{
    boletoNumber: string
    barcode: string
    pdfUrl: string
    transactionId: string
    dueDate: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerateBoleto = async () => {
    setProcessing(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/payments/boleto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          orderId,
          customerId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        setSubmitError(error.message || 'Erro ao gerar boleto')
        onError(error.message || 'Erro ao gerar boleto')
        return
      }

      const result = await response.json()
      setBoletoData(result)
      onSuccess(result.transactionId)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setSubmitError(errorMessage)
      onError(errorMessage)
    } finally {
      setProcessing(false)
    }
  }

  const handleCopyBarcode = () => {
    if (boletoData?.barcode) {
      navigator.clipboard.writeText(boletoData.barcode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (boletoData) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Boleto Gerado com Sucesso!</h3>
          </div>
          <p className="text-sm text-green-800">
            Seu boleto foi gerado e está pronto para pagamento. Vencimento: <strong>{boletoData.dueDate}</strong>
          </p>
        </div>

        {/* Boleto Number Display */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Nosso Número
                </label>
                <input
                  type="text"
                  value={boletoData.boletoNumber}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50 font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Código de Barras
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={boletoData.barcode}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyBarcode}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amount Display */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Valor do Boleto</p>
              <p className="text-3xl font-bold">R$ {(total / 100).toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">Vencimento: {boletoData.dueDate}</p>
            </div>
          </CardContent>
        </Card>

        {/* Download and Payment Options */}
        <div className="grid grid-cols-2 gap-3">
          {boletoData.pdfUrl && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => window.open(boletoData.pdfUrl, '_blank')}
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleCopyBarcode}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar Código
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Como Pagar:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Acesse o site do seu banco ou use o app</li>
            <li>Escolha a opção de pagar um boleto</li>
            <li>Cole o código de barras ou use a imagem do boleto</li>
            <li>Confirme o pagamento</li>
          </ol>
        </div>

        <p className="text-xs text-gray-500 text-center">
          O boleto tem validade até <strong>{boletoData.dueDate}</strong>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <p className="text-sm text-gray-600">
        Gere um boleto para pagar em até 3 dias úteis. Você pode pagar através de qualquer banco.
      </p>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Valor do Boleto</p>
            <p className="text-3xl font-bold">R$ {(total / 100).toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">Vencimento em 3 dias úteis</p>
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <strong>Atenção:</strong> O boleto deve ser pago até o vencimento. Após essa data, poderá haver multa e juros.
        </p>
      </div>

      <Button
        onClick={handleGenerateBoleto}
        className="w-full"
        size="lg"
        disabled={processing || loading}
      >
        {processing || loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gerando Boleto...
          </>
        ) : (
          'Gerar Boleto'
        )}
      </Button>
    </div>
  )
}
