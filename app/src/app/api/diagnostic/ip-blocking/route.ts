import { NextRequest, NextResponse } from 'next/server'
import { diagnoseIpIssue, getVercelInfo, getConnectionInfo } from '@/lib/pagarme-ip-solutions'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Starting IP Blocking diagnostic...')
    
    // Executar múltiplos diagnósticos
    const [vercelInfo, connectionInfo, ipDiagnosis] = await Promise.all([
      Promise.resolve(getVercelInfo()),
      getConnectionInfo(),
      diagnoseIpIssue()
    ])
    
    const fullDiagnosis = {
      timestamp: new Date().toISOString(),
      vercel: vercelInfo,
      connection: connectionInfo,
      ipBlocking: ipDiagnosis,
      summary: {
        isVercelFree: vercelInfo.plan === 'FREE',
        hasDynamicIPs: vercelInfo.plan === 'FREE',
        possibleIpIssue: vercelInfo.plan === 'FREE',
        immediateSolution: 'Configure 76.76.19.0/20 no painel Pagar.me'
      }
    }

    console.log('🎯 IP Diagnosis completed:', fullDiagnosis.summary)
    
    return NextResponse.json({
      success: true,
      diagnosis: fullDiagnosis,
      immediateActions: [
        {
          priority: 1,
          action: 'Configure IP Range in Pagar.me',
          details: 'Add 76.76.19.0/20 to Allowlist',
          location: 'Pagar.me → Settings → Security → Allowed IPs',
          type: 'Vercel IP Range'
        },
        {
          priority: 2, 
          action: 'Disable Allowlist Temporarily',
          details: 'For testing only',
          location: 'Pagar.me → Settings → Security → Disable Allowlist',
          caution: 'Re-enable after testing'
        },
        {
          priority: 3,
          action: 'Upgrade to Vercel Pro',
          details: '$20/month for static IPs',
          location: 'Vercel Dashboard → Plan',
          permanent: true
        }
      ]
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
  } catch (error: any) {
    console.error('❌ IP diagnostic route error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      fallbackActions: [
        '1. Configure 76.76.19.0/20 in Pagar.me Allowlist',
        '2. Disable Allowlist temporarily for testing',
        '3. Check Vercel deployment logs for current IP'
      ],
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'get-current-ip') {
      const info = await getConnectionInfo()
      return NextResponse.json({
        success: true,
        currentIP: info,
        instructions: 'Add this IP to Pagar.me Allowlist or use Vercel IP range 76.76.19.0/20'
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Unknown action',
      availableActions: ['get-current-ip']
    }, { status: 400 })
    
  } catch (error: any) {
    console.error('❌ IP diagnostic POST error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
