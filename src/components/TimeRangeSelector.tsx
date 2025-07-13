import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import OutlinedInput from '@mui/material/OutlinedInput';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface TimeRangeSelectorProps {
  filterTimeRange: string[];
  setFilterTimeRange: (range: string[]) => void;
}

const currentYear = dayjs().year();
const yearOptions = Array.from(
  { length: currentYear - 2000 + 1 },
  (_, i) => dayjs().year(2000 + i).format('YYYY')
);

const selectSx = {
  fontSize: 14,
  minWidth: 70,
  '& .MuiSelect-select': { bgcolor: '#fff', color: '#000' }
};
const outlinedInputSx = {
  bgcolor: '#222',
  color: '#fff',
  fontSize: 14,
  minWidth: 70,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' }
};
const menuItemSx = {
  fontSize: 14,
  bgcolor: '#222',
  color: '#fff',
  '&.Mui-selected': { bgcolor: '#1976d2', color: '#fff' },
  '&:hover': { bgcolor: 'rgba(34,34,34,0.85)' }
};
const menuPaperSx = {
  bgcolor: '#222',
  color: '#fff',
  fontSize: 14,
};
const quickRanges = [
  { label: '近 3 年', years: 3 },
  { label: '近 5 年', years: 5 },
  { label: '近 8 年', years: 8 }
];

// 年份选择框（自定义选择年度范围场景）
function renderYearSelect(value: string, onChange: (v: string) => void) {
  return (
    <Select
      size="small"
      value={value}
      onChange={e => onChange(e.target.value)}
      input={<OutlinedInput sx={outlinedInputSx} />}
      sx={selectSx}
      MenuProps={{ PaperProps: { sx: menuPaperSx } }}
    >
      {yearOptions.map(y => (
        <MenuItem key={y} value={y} sx={menuItemSx}>{y}</MenuItem>
      ))}
    </Select>
  );
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ filterTimeRange, setFilterTimeRange }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [customPopoverEl, setCustomPopoverEl] = useState<null | HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [customStart, setCustomStart] = useState(dayjs().subtract(5, 'year').format('YYYY'));
  const [customEnd, setCustomEnd] = useState(dayjs().format('YYYY'));

  useEffect(() => {
    // 初始化筛选时间范围
    setFilterTimeRange([
      dayjs().subtract(5, 'year').startOf('year').format('YYYY-MM-DD'),
      dayjs().startOf('month').format('YYYY-MM-DD'),
    ]);
  }, [])

  const getLabel = () => {
    if (filterTimeRange.length === 2) {
      const start = dayjs(filterTimeRange[0]).format('YYYY');
      for (const item of quickRanges) {
        if (start === dayjs().subtract(item.years, 'year').startOf('year').format('YYYY')) return item.label;
      }
      return `自訂`;
    }
    return '选择区间';
  };

  // 选择时间范围
  const handleSetRange = (start: string, end: string) => {
    setFilterTimeRange([start, end]);
    setAnchorEl(null);
    setCustomPopoverEl(null);
  };

  return (
    <>
      <Button
        ref={buttonRef}
        variant="contained"
        color="primary"
        sx={{ borderRadius: 2, fontWeight: 600, minWidth: 100, '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.85)' } }}
        disableElevation
        onClick={e => setAnchorEl(e.currentTarget)}
      >
        {getLabel()}
        <KeyboardArrowDownIcon sx={{ ml: 1, fontSize: 22 }} />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { bgcolor: '#222', color: '#fff', minWidth: 120 } }}
      >
        {quickRanges.map(({ label, years }) => {
          const start = dayjs().subtract(years, 'year').startOf('year').format('YYYY-MM-DD');
          const end = dayjs().startOf('month').format('YYYY-MM-DD');
          const selected = filterTimeRange[0] === start && filterTimeRange[1] === end;
          return (
            <MenuItem
              key={label}
              selected={selected}
              onClick={() => handleSetRange(start, end)}
              sx={{
                ...menuItemSx,
                bgcolor: selected ? '#1976d2' : menuItemSx.bgcolor,
                color: selected ? '#fff' : menuItemSx.color
              }}
            >
              {label}
            </MenuItem>
          );
        })}
        <MenuItem
          onClick={() => {
            setCustomPopoverEl(buttonRef.current);
            setAnchorEl(null);
          }}
          sx={menuItemSx}
        >
          自订
        </MenuItem>
      </Menu>
      <Popover
        open={Boolean(customPopoverEl)}
        anchorEl={customPopoverEl}
        onClose={() => setCustomPopoverEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { bgcolor: '#333', color: '#fff', p: 1.5, minWidth: 180 } }}
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography sx={{ fontSize: 14 }}>起始年度：</Typography>
            {renderYearSelect(customStart, setCustomStart)}
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography sx={{ fontSize: 14 }}>结束年度：</Typography>
            {renderYearSelect(customEnd, setCustomEnd)}
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSetRange(
              dayjs(customStart, 'YYYY').startOf('year').format('YYYY-MM-DD'),
              dayjs(customEnd, 'YYYY').endOf('year').format('YYYY-MM-DD')
            )}
            sx={{ mt: 1, py: 0.5, fontSize: 14, bgcolor: '#fff', color: '#1976d2', boxShadow: 'none', '&:hover': { opacity: .9 } }}
            fullWidth
          >
            确定
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default TimeRangeSelector; 