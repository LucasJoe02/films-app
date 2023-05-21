import {useState} from "react";
import {MenuItem, Select, SelectChangeEvent} from "@mui/material";

type OrderDropDownProps = {
    onChange: (selectedValue: string) => void
}

const FilmOrderDropdown = ({ onChange }: OrderDropDownProps) => {
    const [selectedOrder, setSelectedOrder] = useState("releaseDate-asc")
    const handleOrderChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value as string
        setSelectedOrder(selectedValue)
        onChange(selectedValue)
    }

    return (
            <Select value={selectedOrder} onChange={handleOrderChange}>
                <MenuItem value="title-asc">Title: Ascending</MenuItem>
                <MenuItem value="title-desc">Title: Descending</MenuItem>
                <MenuItem value="rating-asc">Rating: Ascending</MenuItem>
                <MenuItem value="rating-desc">Rating: Descending</MenuItem>
                <MenuItem value="releaseDate-asc">Release Date: Ascending</MenuItem>
                <MenuItem value="releaseDate-desc">Release Date: Descending</MenuItem>
            </Select>
    )
}

export default FilmOrderDropdown;