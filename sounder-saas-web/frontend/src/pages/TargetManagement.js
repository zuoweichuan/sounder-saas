import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Button, Grid, Card, CardContent,
  IconButton, Fab, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Badge, Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import TargetDatabaseService from '../utils/TargetDatabaseService';

const TargetManagement = () => {
  const navigate = useNavigate();
  const targetService = TargetDatabaseService.getInstance();
  
  const [targets, setTargets] = useState(targetService.getTargets());
  const [groups, setGroups] = useState(targetService.getGroups());
  const [statistics, setStatistics] = useState(targetService.getStatistics());
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  
  useEffect(() => {
    const unsubscribe = targetService.subscribe(() => {
      setTargets(targetService.getTargets());
      setGroups(targetService.getGroups());
      setStatistics(targetService.getStatistics());
    });

    return unsubscribe;
  }, [targetService]);

  const filteredTargets = targets.filter(target => {
    const matchesSearch = target.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         target.notes.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || target.groupId === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const getGroupInfo = (groupId) => {
    return groups.find(group => group.id === groupId) || { name: '未知分组', color: 'default' };
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/first')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            目标库管理
          </Typography>
        </Box>

        {/* 统计信息 */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            数据库统计
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary">{statistics.total}</Typography>
                <Typography variant="body2">总人数</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="success.main">{statistics.active}</Typography>
                <Typography variant="body2">活跃目标</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="error.main">{statistics.byGroup.blacklist || 0}</Typography>
                <Typography variant="body2">黑名单</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="info.main">{statistics.byGroup.employees || 0}</Typography>
                <Typography variant="body2">员工</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* 搜索和筛选 */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="搜索目标"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="输入姓名或备注进行搜索"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>分组筛选</InputLabel>
                <Select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  label="分组筛选"
                >
                  <MenuItem value="all">全部分组</MenuItem>
                  {groups.map(group => (
                    <MenuItem key={group.id} value={group.id}>
                      <Badge badgeContent={statistics.byGroup[group.id] || 0} color="primary">
                        {group.name}
                      </Badge>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button 
                fullWidth
                variant="outlined"
                onClick={() => navigate('/target-management/groups')}
                startIcon={<GroupIcon />}
              >
                分组管理
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* 目标列表 */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              目标人员 ({filteredTargets.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddDialogOpen(true)}
            >
              添加目标
            </Button>
          </Box>

          {filteredTargets.length > 0 ? (
            <Grid container spacing={2}>
              {filteredTargets.map(target => {
                const groupInfo = getGroupInfo(target.groupId);
                return (
                  <Grid item xs={12} sm={6} md={4} key={target.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 4 }
                      }}
                      onClick={() => navigate(`/target-management/detail/${target.id}`)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          {target.photo ? (
                            <Box
                              component="img"
                              src={target.photo}
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                mr: 2
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                bgcolor: 'grey.300',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2
                              }}
                            >
                              <PersonIcon />
                            </Box>
                          )}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {target.name}
                            </Typography>
                            <Chip 
                              label={groupInfo.name}
                              color={groupInfo.color}
                              size="small"
                            />
                          </Box>
                        </Box>
                        {target.notes && (
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {target.notes}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          创建时间: {new Date(target.createdAt).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <PersonIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                {searchKeyword || selectedGroup !== 'all' ? '未找到匹配的目标' : '暂无目标人员'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {searchKeyword || selectedGroup !== 'all' ? '尝试调整搜索条件' : '点击右下角按钮添加第一个目标'}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* 添加目标的浮动按钮 */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
        onClick={() => setAddDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* 快速添加对话框 */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>快速添加目标</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            这里可以快速创建目标记录，详细信息可以在目标详情页面中完善。
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              setAddDialogOpen(false);
              navigate('/target-management/add');
            }}
            sx={{ mb: 2 }}
          >
            完整添加（推荐）
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>取消</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TargetManagement;
