import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useTokenStore } from '../store/tokenStore';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { StockEntity } from '../types/stock';
import Typography from '@mui/material/Typography';
import { useStockInfo } from '../hooks/useStockInfo';

interface SearchBarProps {
  onSearch: (stock: StockEntity) => void;
  setCurrentStock: (stock: StockEntity) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, setCurrentStock }) => {
  const [keyword, setKeyword] = useState('');
  const token = useTokenStore((state) => state.token) || undefined;
  // 默认股票为台积电-2330
  const defaultStockId = process.env.NEXT_PUBLIC_DEFAULT_STOCK_ID;

  // 使用自定义hook获取股票信息
  const { data: options, loading, error } = useStockInfo(token);

  useEffect(() => {
    // 默认选中第一个股票
    if (options && options.length > 0) {
      setCurrentStock(options.find(o => o.stock_id === defaultStockId) || options[0]);
    }
  }, [options]);

  const handleInputChange = (_: any, value: string) => {
    setKeyword(value);
  };

  const handleSearch = () => {
    // 根据当前输入关键字筛选options
    const filtered = options.filter(opt =>
      typeof opt !== 'string' &&
      (opt.stock_id?.includes(keyword) || opt.stock_name?.includes(keyword))
    );
    if (filtered.length > 0) {
      setKeyword(`${filtered[0].stock_id} ${filtered[0].stock_name}`);
      onSearch(filtered[0]);
    } else {
      setKeyword('');
    }
  };

  // 新增内部高亮工具函数
  function getHighlightParts(text: string, query: string) {
    if (!query) return [{ text, highlight: false }];
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map(part => ({
      text: part,
      highlight: part.toLowerCase() === query.toLowerCase()
    }));
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Autocomplete
        freeSolo
        options={options}
        getOptionLabel={option =>
          typeof option === 'string'
            ? option
            : option.stock_id
              ? `${option.stock_id} ${option.stock_name}`
              : ''
        }
        filterOptions={(opts, state) =>
          opts.filter(opt =>
            typeof opt !== 'string' &&
            (opt.stock_id?.includes(state.inputValue) ||
              opt.stock_name?.includes(state.inputValue))
          )
        }
        loading={loading}
        inputValue={keyword}
        onInputChange={handleInputChange}
        onChange={(_event, value) => {
          if (typeof value !== 'string' && value && value.stock_id) {
            setKeyword(value.stock_id);
            onSearch(value);
          }
        }}
        sx={{ width: 500 }}
        renderOption={(props, option, { inputValue }) => {
          const label = typeof option === 'string'
            ? option
            : `${option.stock_id} ${option.stock_name}`;
          const parts = getHighlightParts(label, inputValue);
          const highLightStyle = {
            color: '#1976d2',
            fontWeight: 700,
            fontSize: '1rem',
          };
          return (
            <li {...props} key={typeof option === 'string' ? option : `${option.stock_id}_${option.stock_name}_${option.industry_category}`}>
              <Typography variant="body2">
                {parts.map((part, index) =>
                  part.highlight ? (
                    <span key={index} style={highLightStyle}>{part.text}</span>
                  ) : (
                    <span key={index}>{part.text}</span>
                  )
                )}
              </Typography>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="輸入台 / 美股代號，查看公司價值"
            variant="outlined"
            size="small"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch} edge="end">
                    <SearchIcon />
                  </IconButton>
                  {loading ? <CircularProgress color="inherit" size={16} sx={{ ml: 1 }} /> : null}
                  {params.InputProps.endAdornment}
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      {error && <Typography color="error" variant="caption">股票信息加载失败</Typography>}
    </Box>
  );
};

export default SearchBar; 