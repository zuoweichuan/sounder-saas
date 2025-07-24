import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Button, TextField, Grid,
  FormControl, InputLabel, Select, MenuItem, IconButton, Alert,
  Card, CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PersonIcon from '@mui/icons-material/Person';
import TargetDatabaseService from '../utils/TargetDatabaseService';

const AddTarget = () => {
  const navigate = useNavigate();
  const targetService = TargetDatabaseService.getInstance();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    groupId: 'employees',
    notes: '',
    photo: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const groups = targetService.getGroups();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePhotoCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          photo: '请选择图片文件'
        }));
        return;
      }

      // 检查文件大小（限制5MB）
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          photo: '图片大小不能超过5MB'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          photo: e.target.result
        }));
        setErrors(prev => ({
          ...prev,
          photo: ''
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '姓名至少需要2个字符';
    }

    if (!formData.groupId) {
      newErrors.groupId = '请选择分组';
    }

    // 检查姓名是否重复
    const existingTargets = targetService.getTargets();
    if (existingTargets.some(target => target.name.trim() === formData.name.trim())) {
      newErrors.name = '该姓名已存在，请使用其他姓名或在备注中添加区分信息';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const newTarget = targetService.addTarget(formData);
      
      // 模拟保存延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      navigate(`/target-management/detail/${newTarget.id}`, {
        state: { message: '目标添加成功！' }
      });
    } catch (error) {
      console.error('添加目标失败:', error);
      setErrors({ submit: '添加失败，请重试' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/target-management')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            添加目标人员
          </Typography>
        </Box>

        {errors.submit && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.submit}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* 照片上传 */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                人员照片
              </Typography>
              <Card sx={{ maxWidth: 300, mx: 'auto' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  {formData.photo ? (
                    <Box
                      component="img"
                      src={formData.photo}
                      sx={{
                        width: 200,
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 2,
                        mb: 2
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 200,
                        height: 200,
                        bgcolor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 2,
                        mb: 2,
                        mx: 'auto'
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 80, color: 'grey.500' }} />
                    </Box>
                  )}
                  
                  <Button
                    variant="outlined"
                    startIcon={<PhotoCameraIcon />}
                    onClick={handlePhotoCapture}
                    fullWidth
                  >
                    {formData.photo ? '更换照片' : '上传照片'}
                  </Button>
                  
                  {errors.photo && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {errors.photo}
                    </Typography>
                  )}
                </CardContent>
              </Card>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </Grid>

            {/* 基本信息 */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                基本信息
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="姓名 *"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="请输入人员姓名"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.groupId}>
                <InputLabel>所属分组 *</InputLabel>
                <Select
                  value={formData.groupId}
                  onChange={(e) => handleInputChange('groupId', e.target.value)}
                  label="所属分组 *"
                >
                  {groups.map(group => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.groupId && (
                  <Typography variant="caption" color="error">
                    {errors.groupId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="备注信息"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                multiline
                rows={3}
                placeholder="请输入备注信息，如职位、部门、特殊说明等"
              />
            </Grid>

            {/* 操作按钮 */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/target-management')}
                  disabled={loading}
                >
                  取消
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? '保存中...' : '保存目标'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default AddTarget;
