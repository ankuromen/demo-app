import React, { useState, useEffect } from 'react';
import nlp from 'compromise';
import Typo from 'typo-js';
import { Input, Button, Flex } from '@chakra-ui/react';

const customHosters = ['Google', 'Facebook', 'Microsoft', 'Apple'];
const customCategories = ['Music', 'Technology', 'Business', 'Networking'];
const customLocations = ['New York', 'Los Angeles', 'Chicago'];
const customDates = ['today', 'tomorrow', 'this weekend', 'next weekend', 'next month', 'next year', 'upcoming', 'soon', 'later', 'future', 'annual', 'biannual', 'quarterly', 'monthly', 'weekly', 'daily', 'tonight', 'this morning', 'this afternoon', 'this evening', 'this week', 'this month', 'this year', 'last year', 'last month', 'last week', 'last night', 'yesterday', 'recently', 'past'];

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [dictionary, setDictionary] = useState(null);

    useEffect(() => {
        const dictionary = new Typo("en_US", false, false, {
             dictionaryPath: 'node_modules/typo-js/dictionaries'
          });
          setDictionary(dictionary);
    }, []);

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSearch = () => {
        if (!dictionary) {
            console.error('Dictionary not loaded yet.');
            return;
        }

        let correctedQuery = query.split(' ').map(word => {
            if (dictionary.check(word)) {
                return word;
            } else {
                const suggestions = dictionary.suggest(word);
                return suggestions.length > 0 ? suggestions[0] : word;
            }
        }).join(' ');

        const doc = nlp(correctedQuery);

        const location = customLocations.find(loc => correctedQuery.toLowerCase().includes(loc.toLowerCase())) || doc.match('#Place').out('text') || "None";
        const date = customDates.find(d => correctedQuery.toLowerCase().includes(d.toLowerCase())) || doc.match('#Date').out('text') || doc.match('on #Date').out('text').replace('on ', '') || "None";
        const eventHoster = customHosters.find(host => correctedQuery.toLowerCase().includes(host.toLowerCase())) || doc.match('by #Person').out('text').replace('by ', '') || "None";
        const category = customCategories.find(cat => correctedQuery.toLowerCase().includes(cat.toLowerCase())) || doc.match('#Noun').out('array').find(word => customCategories.map(c => c.toLowerCase()).includes(word.toLowerCase())) || "None";

        const filters = {
            category: category.charAt(0).toUpperCase() + category.slice(1),
            location: location !== "None" ? location.charAt(0).toUpperCase() + location.slice(1) : "None",
            date: date !== "None" ? date.charAt(0).toUpperCase() + date.slice(1) : "None",
            eventHoster: eventHoster !== "None" ? eventHoster.charAt(0).toUpperCase() + eventHoster.slice(1) : "None"
        };

        onSearch({
            originalQuery: query,
            correctedQuery,
            filters,
        });
    };

    return (
        <Flex align="center" justify="space-between" p={4} bg="gray.100" borderBottom="1px solid #ccc">
            <Input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for accounts, events, communities, posts..."
                fontSize="16px"
                flex="1"
                mr={4}
            />
            <Button onClick={handleSearch} padding="10px" fontSize="16px">
                Search
            </Button>
        </Flex>
    );
};

export default SearchBar;
