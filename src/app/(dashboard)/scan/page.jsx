'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
  Collapse,
  Grid,
  Alert
} from '@mui/material'
import { QrCode2, CameraAlt, Close, CheckCircle, Cancel, Replay } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import ProductForm from '@/components/inventory/product-form'
// import { toast } from "@/hooks/use-toast"

export default function ScanPage() {
  const [scanning, setScanning] = useState(false)
  const [manualEntry, setManualEntry] = useState(false)
  const [upcCode, setUpcCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [productFound, setProductFound] = useState(false)
  const videoRef = useRef < HTMLVideoElement > null
  const canvasRef = useRef < HTMLCanvasElement > null
  const router = useRouter()

  const startScanning = async () => {
    setScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        requestAnimationFrame(scanFrame)
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      toast({
        title: 'Camera Error',
        description: 'Could not access camera. Please check permissions or try manual entry.',
        variant: 'destructive'
      })
      setScanning(false)
    }
  }

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setScanning(false)
  }

  const scanFrame = () => {
    if (scanning && videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        if (!upcCode && Math.random() < 0.01) {
          const mockUpcCodes = ['123456789012', '723456789012', '823456789012', '923456789012']
          const foundUpc = mockUpcCodes[Math.floor(Math.random() * mockUpcCodes.length)]
          setUpcCode(foundUpc)

          context.strokeStyle = '#22c55e'
          context.lineWidth = 5
          context.strokeRect(canvas.width * 0.2, canvas.height * 0.4, canvas.width * 0.6, canvas.height * 0.2)

          setTimeout(() => {
            stopScanning()
            checkProduct(foundUpc)
          }, 1000)

          return
        }

        context.strokeStyle = '#3b82f6'
        context.lineWidth = 3
        context.strokeRect(canvas.width * 0.2, canvas.height * 0.4, canvas.width * 0.6, canvas.height * 0.2)
      }

      if (!upcCode) {
        requestAnimationFrame(scanFrame)
      }
    }
  }

  const checkProduct = code => {
    setLoading(true)
    setTimeout(() => {
      const exists = Number.parseInt(code.charAt(code.length - 1)) % 2 === 0
      setProductFound(exists)
      setLoading(false)

      toast({
        title: exists ? 'Product Found' : 'Product Not Found',
        description: exists
          ? 'This product exists in your inventory. Quantity has been updated.'
          : "This product doesn't exist in your inventory. You can add it now."
      })
    }, 1500)
  }

  const handleManualSubmit = e => {
    e.preventDefault()
    if (upcCode.length > 0) {
      checkProduct(upcCode)
    }
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h4' gutterBottom>
        UPC Scanner
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title='Scan UPC Code'
              subheader='Scan a UPC code to quickly add or update products in your inventory.'
            />
            <CardContent>
              {!scanning && !upcCode && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed',
                    borderColor: 'divider',
                    p: 4,
                    borderRadius: 2,
                    bgcolor: 'action.hover'
                  }}
                >
                  <QrCode2 sx={{ fontSize: 60, mb: 2, color: 'text.secondary' }} />
                  <Typography variant='body2' color='text.secondary' mb={2} align='center'>
                    Position the UPC code within the camera frame to scan
                  </Typography>
                  <Button startIcon={<CameraAlt />} onClick={startScanning}>
                    Start Camera
                  </Button>
                </Box>
              )}

              {scanning && (
                <Box sx={{ position: 'relative' }}>
                  <video ref={videoRef} style={{ width: '100%', borderRadius: 8 }} playsInline muted />
                  <canvas
                    ref={canvasRef}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  />
                  <IconButton
                    onClick={stopScanning}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255,255,255,0.8)'
                    }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              )}

              {upcCode && !scanning && (
                <Box mt={2} p={2} border={1} borderColor='divider' borderRadius={2}>
                  <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
                    <Box>
                      <Typography variant='subtitle2'>UPC Code Detected</Typography>
                      <Typography variant='h6'>{upcCode}</Typography>
                    </Box>
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : productFound ? (
                      <CheckCircle color='success' />
                    ) : (
                      <Cancel color='warning' />
                    )}
                  </Box>

                  {loading ? (
                    <Typography variant='body2' color='text.secondary'>
                      Checking inventory...
                    </Typography>
                  ) : productFound ? (
                    <>
                      <Typography variant='body2' color='text.secondary' mb={2}>
                        This product exists in your inventory. The quantity has been incremented.
                      </Typography>
                      <Box display='flex' gap={2}>
                        <Button onClick={() => router.push('/inventory')}>View Inventory</Button>
                        <Button
                          variant='outlined'
                          startIcon={<Replay />}
                          onClick={() => {
                            setUpcCode('')
                            setProductFound(false)
                          }}
                        >
                          Scan Another
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Alert severity='info'>This product doesn't exist in your inventory. You can add it below.</Alert>
                  )}
                </Box>
              )}

              {!scanning && !upcCode && (
                <Box mt={3}>
                  <Button onClick={() => setManualEntry(prev => !prev)}>
                    {manualEntry ? 'Hide manual entry' : 'Enter UPC code manually'}
                  </Button>

                  <Collapse in={manualEntry}>
                    <Box component='form' onSubmit={handleManualSubmit} mt={2}>
                      <TextField
                        fullWidth
                        label='UPC Code'
                        value={upcCode}
                        onChange={e => setUpcCode(e.target.value)}
                        variant='outlined'
                      />
                      <Button type='submit' variant='contained' disabled={!upcCode || loading} sx={{ mt: 2 }}>
                        {loading ? (
                          <>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Checking...
                          </>
                        ) : (
                          'Check UPC'
                        )}
                      </Button>
                    </Box>
                  </Collapse>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {upcCode && !productFound && !loading && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title='Add New Product' subheader='Enter details to add it to your inventory.' />
              <CardContent>
                <ProductForm initialUpc={upcCode} />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
