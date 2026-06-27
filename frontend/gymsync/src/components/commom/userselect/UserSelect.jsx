import styles from './UserSelect.module.css';

/**
 * Searchable user selector.
 * Filters a list of users by name as the user types.
 * Renders a dropdown of matches and calls onSelect with the chosen user.
 *
 * @param {Array<{ id, name, email }>} users
 * @param {Object|null} selected    - Currently selected user
 * @param {Function} onSelect       - Called with the full user object
 * @param {string} placeholder
 * @param {boolean} disabled
 */
import { useState, useRef, useEffect } from 'react';

export default function UserSelect({ users, selected, onSelect, placeholder = 'Search by name...', disabled = false }) {
    const [query, setQuery]       = useState('');
    const [open, setOpen]         = useState(false);
    const containerRef            = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClick(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const filtered = users.filter((u) =>
        u.name.toLowerCase().includes(query.toLowerCase())
    );

    function handleSelect(user) {
        onSelect(user);
        setQuery(user.name);
        setOpen(false);
    }

    function handleChange(e) {
        setQuery(e.target.value);
        setOpen(true);
        if (!e.target.value) onSelect(null);
    }

    return (
        <div className={styles.wrapper} ref={containerRef}>
            <input
                className={styles.input}
                value={selected && !open ? selected.name : query}
                onChange={handleChange}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
            />
            {selected && !open && (
                <span className={styles.selectedBadge}>{selected.email}</span>
            )}
            {open && query.length > 0 && (
                <div className={styles.dropdown}>
                    {filtered.length === 0 ? (
                        <p className={styles.noResults}>No users found.</p>
                    ) : (
                        filtered.map((u) => (
                            <button
                                key={u.id}
                                type="button"
                                className={styles.option}
                                onClick={() => handleSelect(u)}
                            >
                                <span className={styles.optionName}>{u.name}</span>
                                <span className={styles.optionEmail}>{u.email}</span>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}