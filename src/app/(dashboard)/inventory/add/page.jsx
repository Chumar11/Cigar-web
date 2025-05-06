'use client'
import React, { useState } from 'react'
import { Box, Button, Grid, Paper, Stack, TextField, Typography, IconButton, InputAdornment } from '@mui/material'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    upcCode: '',
    productName: '',
    quantity: 1,
    price: 0.0,
    description: ''
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value
    }))
  }

  const handleSave = () => {
    console.log('Saved:', formData)
  }

  const handleCancel = () => {
    setFormData({
      upcCode: '',
      productName: '',
      quantity: 1,
      price: 0.0,
      description: ''
    })
  }

  return (
    <Box mt={4}>
      <Typography variant='h5' fontWeight='bold'>
        Add New Product
      </Typography>
      <Typography color='text.secondary' mb={3}>
        Add a new product to your inventory with UPC code and details.
      </Typography>

      <Paper variant='outlined' sx={{ padding: 3 }}>
        <Typography variant='h6' fontWeight='bold' gutterBottom>
          Product Details
        </Typography>
        <Typography color='text.secondary' mb={2}>
          Enter the product information or scan a UPC code to add a new product to your inventory.
        </Typography>

        <Stack spacing={2}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={10}>
              <TextField
                fullWidth
                label='UPC Code'
                placeholder='Enter UPC code'
                name='upcCode'
                value={formData.upcCode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={2}>
              <Button fullWidth startIcon={<QrCodeScannerIcon />} variant='outlined' sx={{ height: '100%' }}>
                Scan UPC
              </Button>
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label='Product Name'
            placeholder='Enter product name'
            name='productName'
            value={formData.productName}
            onChange={handleChange}
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Quantity'
                name='quantity'
                type='number'
                value={formData.quantity}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Price (Optional)'
                name='price'
                type='number'
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position='start'>$</InputAdornment>
                }}
                helperText='Enter price in USD'
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            multiline
            minRows={3}
            label='Description (Optional)'
            placeholder='Enter product description'
            name='description'
            value={formData.description}
            onChange={handleChange}
          />

          <Box display='flex' gap={2} mt={2}>
            <Button variant='contained' color='primary' onClick={handleSave} sx={{ textTransform: 'none' }}>
              Save Product
            </Button>
            <Button variant='outlined' onClick={handleCancel} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}

export default AddProductForm
