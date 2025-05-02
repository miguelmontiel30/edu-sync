CREATE OR REPLACE FUNCTION create_user_from_entity()
RETURNS TRIGGER AS $$
DECLARE
  new_email TEXT;
  random_pass TEXT;
  hashed_pass TEXT;
  new_user_id INTEGER;
  role_name TEXT;
  entity_id INTEGER;
BEGIN
  -- Generar contraseña aleatoria simple de 8 caracteres
  random_pass := substr(md5(random()::text), 0, 9);
  hashed_pass := crypt(random_pass, gen_salt('bf'));

  -- Detectar entidad y construir email + nombre
  IF TG_TABLE_NAME = 'students' THEN
    -- Usar email de estudiante si está disponible, o crear uno
    new_email := COALESCE(NEW.email, lower(NEW.first_name || '.' || NEW.father_last_name) || '@escuela.com');
    role_name := 'student';
    entity_id := NEW.student_id;
  ELSIF TG_TABLE_NAME = 'teachers' THEN
    -- Usar email de profesor si está disponible, o crear uno
    new_email := COALESCE(NEW.email, lower(NEW.first_name || '.' || NEW.father_last_name) || '@escuela.com');
    role_name := 'teacher';
    entity_id := NEW.teacher_id;
  ELSIF TG_TABLE_NAME = 'tutors' THEN
    -- Usar email de tutor si está disponible, o crear uno
    new_email := COALESCE(NEW.email, lower(NEW.first_name || '.' || NEW.father_last_name) || '@escuela.com');
    role_name := 'tutor';
    entity_id := NEW.tutor_id;
  END IF;

  -- Crear usuario
  INSERT INTO users (
    school_id,
    email,
    password_hash,
    plain_password,
    first_name,
    last_name,
    linked_id,
    linked_type,
    delete_flag,
    created_at,
    updated_at
  ) VALUES (
    NEW.school_id,
    new_email,
    hashed_pass,
    random_pass,
    CASE 
      WHEN TG_TABLE_NAME = 'students' THEN NEW.first_name
      WHEN TG_TABLE_NAME = 'teachers' THEN NEW.first_name
      WHEN TG_TABLE_NAME = 'tutors' THEN NEW.first_name
    END,
    CASE 
      WHEN TG_TABLE_NAME = 'students' THEN NEW.father_last_name
      WHEN TG_TABLE_NAME = 'teachers' THEN NEW.father_last_name
      WHEN TG_TABLE_NAME = 'tutors' THEN NEW.father_last_name
    END,
    entity_id,
    TG_TABLE_NAME,
    FALSE,
    NOW(),
    NOW()
  )
  RETURNING user_id INTO new_user_id;

  -- Asignar rol
  INSERT INTO user_roles (user_id, role_id)
  SELECT new_user_id, role_id FROM roles WHERE name = role_name;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;




CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
