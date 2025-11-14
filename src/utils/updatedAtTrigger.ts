export const updatedAtTrigger = (tableName: string) => {
    return `
    CREATE OR REPLACE FUNCTION update_${tableName}_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updatedAt = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    CREATE OR REPLACE TRIGGER update_${tableName}_updated_at 
        BEFORE UPDATE ON "${tableName}" 
        FOR EACH ROW 
        EXECUTE FUNCTION update_${tableName}_updated_at_column();
    `;
};
