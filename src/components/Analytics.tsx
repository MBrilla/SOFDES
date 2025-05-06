import { Card, Row, Col, Statistic, Progress, List, Typography, Space, Tag } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useTodo } from '../context/TodoContext'
import dayjs from 'dayjs'
import { useMemo } from 'react'

const { Title, Text } = Typography

const MotionCard = motion(Card)

export function Analytics() {
  const { todos } = useTodo()

  const stats = useMemo(() => {
    const total = todos.length
    const completed = todos.filter(todo => todo.completed).length
    const inProgress = todos.filter(todo => todo.status === 'in-progress').length
    const overdue = todos.filter(todo => 
      todo.dueDate && !todo.completed && dayjs(todo.dueDate).isBefore(dayjs(), 'day')
    ).length

    const categoryStats = todos.reduce((acc, todo) => {
      if (todo.category) {
        acc[todo.category] = (acc[todo.category] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const priorityStats = todos.reduce((acc, todo) => {
      if (todo.priority) {
        acc[todo.priority] = (acc[todo.priority] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const completionRate = total > 0 ? (completed / total) * 100 : 0

    return {
      total,
      completed,
      inProgress,
      overdue,
      categoryStats,
      priorityStats,
      completionRate
    }
  }, [todos])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#f5222d'
      case 'medium':
        return '#faad14'
      case 'low':
        return '#52c41a'
      default:
        return '#1890ff'
    }
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Analytics Dashboard</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Statistic
              title="Total Tasks"
              value={stats.total}
              prefix={<CheckCircleOutlined />}
            />
          </MotionCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Statistic
              title="Completed"
              value={stats.completed}
              valueStyle={{ color: '#52c41a' }}
            />
          </MotionCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Statistic
              title="In Progress"
              value={stats.inProgress}
              valueStyle={{ color: '#1890ff' }}
            />
          </MotionCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Statistic
              title="Overdue"
              value={stats.overdue}
              valueStyle={{ color: '#f5222d' }}
            />
          </MotionCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <MotionCard
            title="Completion Rate"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Progress
              type="circle"
              percent={Math.round(stats.completionRate)}
              format={percent => `${percent}%`}
              width={120}
            />
            <Text type="secondary" style={{ marginLeft: 16 }}>
              {stats.completed} of {stats.total} tasks completed
            </Text>
          </MotionCard>
        </Col>
        <Col xs={24} md={12}>
          <MotionCard
            title="Priority Distribution"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <List
              dataSource={Object.entries(stats.priorityStats)}
              renderItem={([priority, count]) => (
                <List.Item>
                  <Space>
                    <Tag color={getPriorityColor(priority)}>
                      {priority.toUpperCase()}
                    </Tag>
                    <Text>{count} tasks</Text>
                    <Progress
                      percent={Math.round((count / stats.total) * 100)}
                      size="small"
                      showInfo={false}
                      strokeColor={getPriorityColor(priority)}
                    />
                  </Space>
                </List.Item>
              )}
            />
          </MotionCard>
        </Col>
      </Row>

      <MotionCard
        title="Category Distribution"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <List
          dataSource={Object.entries(stats.categoryStats)}
          renderItem={([category, count]) => (
            <List.Item>
              <Space>
                <Tag color="blue">{category}</Tag>
                <Text>{count} tasks</Text>
                <Progress
                  percent={Math.round((count / stats.total) * 100)}
                  size="small"
                  showInfo={false}
                />
              </Space>
            </List.Item>
          )}
        />
      </MotionCard>
    </Space>
  )
} 