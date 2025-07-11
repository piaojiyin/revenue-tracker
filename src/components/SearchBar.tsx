import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    onSearch(keyword);
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <TextField
        label="輸入台／美股代號，查看公司價值"
        variant="outlined"
        size="small"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        sx={{ width: 350 }}
      />
      <Button variant="contained" onClick={handleSearch}>
        查詢
      </Button>
    </Box>
  );
};

export default SearchBar; 