'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, Copy, Loader2, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'

interface PIXFormProps {
  total: number
  orderId?: string
  customerId?: string
  onSuccess: (paymentId: string, method: 'pix') => void
  onError: (error: string) => void
  loading?: boolean
}

export function PIXForm({
  total,
  orderId,
  customerId,
  onSuccess,
  onError,
  loading = false,
}: PIXFormProps) {
  const [processing, setProcessing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [pixData, setPixData] = useState<{
    qrCode: string
    qrCodeUrl: string
    pixKey: string
    transactionId: string
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [countdown, setCountdown] = useState(1800) // 30 minutos em segundos
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleGeneratePIX = async () => {
    setProcessing(true)
    setSubmitError(null)
    setShowSuccessMessage(false)

    try {
      // Usar API v5 ao invés da v1
      const response = await fetch('/api/payments/pix-v5', {
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
        setSubmitError(error.message || 'Erro ao gerar PIX')
        onError(error.message || 'Erro ao gerar PIX')
        return
      }

      const result = await response.json()
      setPixData(result)
      
      // INÍCIO MELHORIA UX: Mostrar PIX por 30 segundos antes de redirecionar
      setShowSuccessMessage(true)
      
      // Timer para countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            setPaymentCompleted(true)
            onSuccess(result.transactionId, 'pix')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // Limpar timer quando componente desmontar
      return () => clearInterval(timer)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setSubmitError(errorMessage)
      onError(errorMessage)
    } finally {
      setProcessing(false)
    }
  }

  const handleCopyPIXKey = () => {
    if (pixData?.pixKey) {
      navigator.clipboard.writeText(pixData.pixKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Se PIX foi gerado e está exibindo
  if (pixData && showSuccessMessage) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900">PIX Gerado com Sucesso!</h3>
          </div>
          <p className="text-sm text-green-800 mb-4">
            Complete o pagamento. Você será redirecionado automaticamente em {formatTime(countdown)} segundos.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <p className="text-sm text-blue-900">
              <strong>Aguarde alguns segundos</strong> para ver o QR code e a chave PIX.
            </p>
          </div>
        </div>

        {/* Timer */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Aguarde...</p>
              <p className="text-2xl font-bold text-blue-600">{formatTime(countdown)}</p>
              <p className="text-xs text-gray-500">segundos restantes</p>
            </div>
          </CardContent>
        </Card>

        {/* Mensagem informativa */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Acompanhe seu pedido na página "Meus Pedidos" após o pagamento.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Se PIX foi gerado e carregado
  if (pixData && !showSuccessMessage) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900">PIX Pronto para Pagamento!</h3>
          </div>
          <p className="text-sm text-green-800 mb-4">
            Escaneie o código QR ou copie a chave PIX abaixo para completar o pagamento.
          </p>
        </div>

        {/* QR Code */}
        {pixData.qrCodeUrl && (
          <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
            <img
              src={pixData.qrCodeUrl}
              alt="QR Code PIX"
              className="w-48 h-48"
            />
          </div>
        )}

        {/* PIX Key */}
        <div>
          <label className="text-sm font-medium block mb-2">Chave PIX (Copia e Cola)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={pixData.pixKey}
              readOnly
              className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 font-mono text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyPIXKey}
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

        {/* Amount Display */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Valor a pagar</p>
              <p className="text-3xl font-bold">R$ {(total / 100).toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">com desconto de 2%</p>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Como Pagar:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Abra seu app de banco ou carteira digital</li>
            <li>Selecione a opção para pagar com PIX</li>
            <li>Escolha entre escanear o código QR ou copiar a chave</li>
            <li>Confirme o pagamento</li>
          </ol>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Você será redirecionado automaticamente após o pagamento
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
        Gere um código PIX para pagar de forma instantânea. Você receberá um desconto de 2% no total.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Desconto PIX:</strong> R$ {(total * 0.02 / 100).toFixed(2)} (-2%)
        </p>
        <p className="text-lg font-bold text-blue-900 mt-2">
          Total: R$ {(total * 0.98 / 100).toFixed(2)}
        </p>
      </div>

      <Button
        onClick={handleGeneratePIX}
        className="w-full"
        size="lg"
        disabled={processing || loading}
      >
        {processing || loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gerando PIX...
          </>
        ) : (
          'Gerar Código PIX'
        )}
      </Button>
    </div>
  )
}
