import { useState } from 'react'
import { Card, List, Tag, Space, Button, Input, Typography, Popconfirm, message } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { useTodo } from '../context/TodoContext'

const { Text } = Typography

export default function CategoriesView() {
  const { todos, categories, addCategory, deleteCategory, updateCategoryName } = useTodo()
  const [newCategory, setNewCategory] = useState('')
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      addCategory(newCategory.trim())
      setNewCategory('')
      message.success('Category added successfully')
    } else {
      message.error('Invalid category name or category already exists')
    }
  }

  const handleDeleteCategory = (category: string) => {
    const todosWithCategory = todos.filter(todo => todo.category === category)
    if (todosWithCategory.length > 0) {
      message.warning(`Cannot delete category "${category}" as it is being used by ${todosWithCategory.length} todos`)
      return
    }
    deleteCategory(category)
    message.success('Category deleted successfully')
  }

  const handleStartEdit = (category: string) => {
    setEditingCategory(category)
    setEditValue(category)
  }

  const handleSaveEdit = () => {
    if (editingCategory && editValue.trim() && editValue !== editingCategory) {
      if (categories.includes(editValue.trim())) {
        message.error('Category already exists')
        return
      }
      updateCategoryName(editingCategory, editValue.trim())
      setEditingCategory(null)
      message.success('Category updated successfully')
    }
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
    setEditValue('')
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title="Manage Categories">
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onPressEnter={handleAddCategory}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategory}>
            Add Category
          </Button>
        </Space.Compact>
      </Card>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        dataSource={categories}
        renderItem={(category) => (
          <List.Item>
            <Card>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                {editingCategory === category ? (
                  <Space.Compact>
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onPressEnter={handleSaveEdit}
                    />
                    <Button type="primary" icon={<CheckOutlined />} onClick={handleSaveEdit} />
                    <Button icon={<CloseOutlined />} onClick={handleCancelEdit} />
                  </Space.Compact>
                ) : (
                  <>
                    <Space>
                      <Tag color="blue">{category}</Tag>
                      <Text type="secondary">
                        {todos.filter(todo => todo.category === category).length} todos
                      </Text>
                    </Space>
                    <Space>
                      <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => handleStartEdit(category)}
                      />
                      <Popconfirm
                        title="Delete category"
                        description="Are you sure you want to delete this category?"
                        onConfirm={() => handleDeleteCategory(category)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />}
                          disabled={todos.some(todo => todo.category === category)}
                        />
                      </Popconfirm>
                    </Space>
                  </>
                )}
              </Space>
            </Card>
          </List.Item>
        )}
      />
    </Space>
  )
} 