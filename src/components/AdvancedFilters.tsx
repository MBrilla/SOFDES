import { useState } from 'react'
import { Card, DatePicker, Select, Space, Button, Tag, Tooltip, Popover } from 'antd'
import { FilterOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons'
import type { RangePickerProps } from 'antd/es/date-picker'
import { useTodo } from '../context/TodoContext'
import { motion } from 'framer-motion'

const { RangePicker } = DatePicker
const MotionCard = motion(Card)

interface FilterPreset {
  id: string
  name: string
  dateRange: [Date, Date] | null
  categories: string[]
  priorities: string[]
}

interface AdvancedFiltersProps {
  onFilterChange: (filters: {
    dateRange: [Date, Date] | null
    categories: string[]
    priorities: string[]
  }) => void
}

export default function AdvancedFilters({ onFilterChange }: AdvancedFiltersProps) {
  const { categories } = useTodo()
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [presets, setPresets] = useState<FilterPreset[]>(() => {
    const saved = localStorage.getItem('filterPresets')
    return saved ? JSON.parse(saved) : []
  })

  const handleDateRangeChange: RangePickerProps['onChange'] = (dates) => {
    if (dates) {
      setDateRange([dates[0]?.toDate() || null, dates[1]?.toDate() || null])
      applyFilters(dates[0]?.toDate() || null, dates[1]?.toDate() || null, selectedCategories, selectedPriorities)
    } else {
      setDateRange(null)
      applyFilters(null, null, selectedCategories, selectedPriorities)
    }
  }

  const handleCategoryChange = (values: string[]) => {
    setSelectedCategories(values)
    applyFilters(dateRange?.[0], dateRange?.[1], values, selectedPriorities)
  }

  const handlePriorityChange = (values: string[]) => {
    setSelectedPriorities(values)
    applyFilters(dateRange?.[0], dateRange?.[1], selectedCategories, values)
  }

  const applyFilters = (
    startDate: Date | null,
    endDate: Date | null,
    categories: string[],
    priorities: string[]
  ) => {
    onFilterChange({
      dateRange: startDate && endDate ? [startDate, endDate] : null,
      categories,
      priorities,
    })
  }

  const savePreset = () => {
    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name: `Preset ${presets.length + 1}`,
      dateRange,
      categories: selectedCategories,
      priorities: selectedPriorities,
    }
    const updatedPresets = [...presets, newPreset]
    setPresets(updatedPresets)
    localStorage.setItem('filterPresets', JSON.stringify(updatedPresets))
  }

  const loadPreset = (preset: FilterPreset) => {
    setDateRange(preset.dateRange)
    setSelectedCategories(preset.categories)
    setSelectedPriorities(preset.priorities)
    applyFilters(
      preset.dateRange?.[0] || null,
      preset.dateRange?.[1] || null,
      preset.categories,
      preset.priorities
    )
  }

  const deletePreset = (id: string) => {
    const updatedPresets = presets.filter(p => p.id !== id)
    setPresets(updatedPresets)
    localStorage.setItem('filterPresets', JSON.stringify(updatedPresets))
  }

  const presetContent = (
    <div style={{ minWidth: '200px' }}>
      {presets.map(preset => (
        <div key={preset.id} style={{ marginBottom: '8px' }}>
          <Space>
            <Button type="link" onClick={() => loadPreset(preset)}>
              {preset.name}
            </Button>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => deletePreset(preset.id)}
            />
          </Space>
        </div>
      ))}
      {presets.length === 0 && (
        <div style={{ color: '#999' }}>No saved presets</div>
      )}
    </div>
  )

  return (
    <MotionCard
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ marginBottom: '16px' }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space wrap>
          <RangePicker
            onChange={handleDateRangeChange}
            style={{ width: '300px' }}
          />
          <Select
            mode="multiple"
            placeholder="Select categories"
            style={{ width: '200px' }}
            options={categories.map(cat => ({ label: cat, value: cat }))}
            value={selectedCategories}
            onChange={handleCategoryChange}
          />
          <Select
            mode="multiple"
            placeholder="Select priorities"
            style={{ width: '200px' }}
            options={[
              { label: 'High', value: 'high' },
              { label: 'Medium', value: 'medium' },
              { label: 'Low', value: 'low' },
            ]}
            value={selectedPriorities}
            onChange={handlePriorityChange}
          />
          <Popover
            content={presetContent}
            title="Saved Presets"
            trigger="click"
            placement="bottomRight"
          >
            <Button icon={<FilterOutlined />}>Presets</Button>
          </Popover>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={savePreset}
          >
            Save Preset
          </Button>
        </Space>
        <Space wrap>
          {selectedCategories.map(category => (
            <Tag
              key={category}
              closable
              onClose={() => handleCategoryChange(selectedCategories.filter(c => c !== category))}
            >
              {category}
            </Tag>
          ))}
          {selectedPriorities.map(priority => (
            <Tag
              key={priority}
              color={
                priority === 'high' ? 'red' :
                priority === 'medium' ? 'orange' : 'green'
              }
              closable
              onClose={() => handlePriorityChange(selectedPriorities.filter(p => p !== priority))}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Tag>
          ))}
        </Space>
      </Space>
    </MotionCard>
  )
} 