import React, {ReactNode} from "react";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

const FilmAgeRatingFilter = ({ selectedAgeRatings, handleAgeRatingChange}: {
    selectedAgeRatings: string[];
    handleAgeRatingChange: (event: SelectChangeEvent<string[]>, child: ReactNode) => void;
}) => {
    const ageRatingList = ["G", "PG", "M", "R13", "R16", "R18", "TBC"]

    return (
        <FormControl style={{minWidth: '230px', marginTop: '1rem'}}>
            <InputLabel>Age Rating Filter</InputLabel>
            <Select
                style={{marginTop: '0.5rem'}}
                multiple
                value={selectedAgeRatings}
                onChange={handleAgeRatingChange}
                renderValue={(selected) => selected.join(', ')}
            >
                {ageRatingList.map((ageRating) => (
                    <MenuItem key={ageRating} value={ageRating}>
                        {ageRating}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default FilmAgeRatingFilter;