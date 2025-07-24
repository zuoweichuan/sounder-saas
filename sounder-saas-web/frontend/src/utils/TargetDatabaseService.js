class TargetDatabaseService {
  constructor() {
    this.targets = [];
    this.groups = [
      { id: 'employees', name: '员工', color: 'success' },
      { id: 'vip', name: 'VIP访客', color: 'primary' },
      { id: 'blacklist', name: '关注人员(黑名单)', color: 'error' },
      { id: 'whitelist', name: '白名单', color: 'info' },
      { id: 'strangers', name: '陌生人', color: 'default' }
    ];
    this.listeners = [];
    
    // 从localStorage加载数据
    this.loadFromStorage();
  }

  static getInstance() {
    if (!TargetDatabaseService.instance) {
      TargetDatabaseService.instance = new TargetDatabaseService();
    }
    return TargetDatabaseService.instance;
  }

  // 保存到本地存储
  saveToStorage() {
    try {
      localStorage.setItem('targetDatabase', JSON.stringify({
        targets: this.targets,
        groups: this.groups
      }));
    } catch (error) {
      console.error('保存目标库数据失败:', error);
    }
  }

  // 从本地存储加载
  loadFromStorage() {
    try {
      const data = localStorage.getItem('targetDatabase');
      if (data) {
        const parsed = JSON.parse(data);
        this.targets = parsed.targets || [];
        this.groups = parsed.groups || this.groups;
      }
    } catch (error) {
      console.error('加载目标库数据失败:', error);
    }
  }

  // 添加目标人员
  addTarget(targetData) {
    const target = {
      id: Date.now().toString(),
      name: targetData.name,
      groupId: targetData.groupId,
      photo: targetData.photo, // base64格式的照片
      notes: targetData.notes,
      createdAt: new Date(),
      lastSeen: null,
      isActive: true
    };
    
    this.targets.push(target);
    this.saveToStorage();
    this.notifyListeners();
    return target;
  }

  // 更新目标人员
  updateTarget(id, updateData) {
    const index = this.targets.findIndex(target => target.id === id);
    if (index !== -1) {
      this.targets[index] = { ...this.targets[index], ...updateData };
      this.saveToStorage();
      this.notifyListeners();
      return this.targets[index];
    }
    return null;
  }

  // 删除目标人员
  deleteTarget(id) {
    const index = this.targets.findIndex(target => target.id === id);
    if (index !== -1) {
      this.targets.splice(index, 1);
      this.saveToStorage();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // 获取所有目标
  getTargets() {
    return this.targets;
  }

  // 按分组获取目标
  getTargetsByGroup(groupId) {
    return this.targets.filter(target => target.groupId === groupId);
  }

  // 获取所有分组
  getGroups() {
    return this.groups;
  }

  // 添加自定义分组
  addGroup(name, color = 'default') {
    const group = {
      id: Date.now().toString(),
      name,
      color
    };
    this.groups.push(group);
    this.saveToStorage();
    this.notifyListeners();
    return group;
  }

  // 删除分组（需要先移动该分组下的所有目标）
  deleteGroup(groupId) {
    // 不能删除默认分组
    const defaultGroups = ['employees', 'vip', 'blacklist', 'whitelist', 'strangers'];
    if (defaultGroups.includes(groupId)) {
      return false;
    }

    // 将该分组下的目标移至"陌生人"分组
    this.targets.forEach(target => {
      if (target.groupId === groupId) {
        target.groupId = 'strangers';
      }
    });

    const index = this.groups.findIndex(group => group.id === groupId);
    if (index !== -1) {
      this.groups.splice(index, 1);
      this.saveToStorage();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // 搜索目标
  searchTargets(keyword) {
    return this.targets.filter(target => 
      target.name.toLowerCase().includes(keyword.toLowerCase()) ||
      target.notes.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // 获取统计信息
  getStatistics() {
    const stats = {};
    this.groups.forEach(group => {
      stats[group.id] = this.getTargetsByGroup(group.id).length;
    });
    return {
      total: this.targets.length,
      active: this.targets.filter(t => t.isActive).length,
      byGroup: stats
    };
  }

  // 订阅数据变更
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

export default TargetDatabaseService;
