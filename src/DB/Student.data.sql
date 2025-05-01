-- Script para insertar estudiantes en la base de datos
-- 15 estudiantes para escuela con id 1
-- 12 estudiantes para escuela con id 2
-- Insertar estudiantes para escuela_id = 1
INSERT INTO
    students (
        school_id,
        first_name,
        father_last_name,
        mother_last_name,
        birth_date,
        gender_id,
        curp,
        phone,
        email,
        image_url,
        delete_flag,
        created_at,
        updated_at
    )
VALUES
    -- Escuela 1 (15 estudiantes)
    (
        1,
        'Ana',
        'García',
        'Martínez',
        '2011-08-21',
        2, -- Femenino
        'GAMA110821MDFRZN02',
        '5551112234',
        'ana.garcia2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        1,
        'Luis',
        'Hernández',
        'Ramírez',
        '2012-01-03',
        1, -- Masculino
        'HERL120103HDFRZN04',
        '5551112235',
        'luis.hernandez2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        1,
        'Sofía',
        'Martínez',
        'Pérez',
        '2010-11-17',
        2, -- Femenino
        'MAPS101117MDFRZN08',
        '5551112236',
        'sofia.martinez2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        1,
        'Carlos',
        'López',
        'Sánchez',
        '2009-07-09',
        1, -- Masculino
        'LOSC090709HDFRZN00',
        '5551112237',
        'carlos.lopez2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        1,
        'Isabella',
        'Ramírez',
        'Flores',
        '2013-04-29',
        2, -- Femenino
        'RAFI130429MDFRZN03',
        '5551112238',
        'isabella.ramirez2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        1,
        'Diego',
        'Sánchez',
        'Gómez',
        '2011-02-19',
        1, -- Masculino
        'SADG110219HDFRZN07',
        '5551112239',
        'diego.sanchez2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        1,
        'Valentina',
        'Torres',
        'Cruz',
        '2010-09-15',
        2, -- Femenino
        'TOCV100915MDFRZN01',
        '5551112240',
        'valentina.torres2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        1,
        'Emiliano',
        'Flores',
        'Morales',
        '2009-06-03',
        1, -- Masculino
        'FLME090603HDFRZN05',
        '5551112241',
        'emiliano.flores2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        1,
        'Camila',
        'Gómez',
        'Luna',
        '2012-12-27',
        2, -- Femenino
        'GOLC121227MDFRZN06',
        '5551112242',
        'camila.gomez2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        1,
        'Mateo',
        'Reyes',
        'Navarro',
        '2011-03-10',
        1, -- Masculino
        'REMN110310HDFRZN00',
        '5551112243',
        'mateo.reyes2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        1,
        'Renata',
        'Morales',
        'Jiménez',
        '2013-07-22',
        2, -- Femenino
        'MOJR130722MDFRZN09',
        '5551112244',
        'renata.morales2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        1,
        'Daniel',
        'Cruz',
        'Vega',
        '2010-10-05',
        1, -- Masculino
        'CRVD101005HDFRZN02',
        '5551112245',
        'daniel.cruz2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        1,
        'María',
        'Jiménez',
        'Ortiz',
        '2011-01-18',
        2, -- Femenino
        'JIOM110118MDFRZN07',
        '5551112246',
        'maria.jimenez2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        1,
        'Andrés',
        'Navarro',
        'Castañeda',
        '2009-09-30',
        1, -- Masculino
        'NACA090930HDFRZN03',
        '5551112247',
        'andres.navarro2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    -- Escuela 2 (12 estudiantes)
    (
        2,
        'Laura',
        'Mendoza',
        'Ríos',
        '2010-05-15',
        2, -- Femenino
        'MERL100515MDFNDR1',
        '5552223344',
        'laura.mendoza2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        2,
        'Pablo',
        'Vargas',
        'Lara',
        '2011-07-22',
        1, -- Masculino
        'VALP110722HDFRBL2',
        '5552223345',
        'pablo.vargas2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        2,
        'Elena',
        'Fuentes',
        'Paredes',
        '2012-03-18',
        2, -- Femenino
        'FUPE120318MDFNTL3',
        '5552223346',
        'elena.fuentes2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        2,
        'Adrián',
        'Rojas',
        'Moreno',
        '2009-11-30',
        1, -- Masculino
        'ROMA091130HDFJSD4',
        '5552223347',
        'adrian.rojas2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        2,
        'Natalia',
        'Cordero',
        'Soto',
        '2011-09-12',
        2, -- Femenino
        'COSN110912MDFRDNT5',
        '5552223348',
        'natalia.cordero2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        2,
        'Javier',
        'Aguilar',
        'Chávez',
        '2010-02-28',
        1, -- Masculino
        'AGCJ100228HDFJVR6',
        '5552223349',
        'javier.aguilar2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        2,
        'Valeria',
        'Medina',
        'Castro',
        '2012-08-07',
        2, -- Femenino
        'MECV120807MDFDSV7',
        '5552223350',
        'valeria.medina2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        2,
        'Eduardo',
        'Ramos',
        'Guzmán',
        '2009-06-19',
        1, -- Masculino
        'RAGE090619HDFRMD8',
        '5552223351',
        'eduardo.ramos2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        2,
        'Carolina',
        'Escobar',
        'Delgado',
        '2010-10-25',
        2, -- Femenino
        'ESDC101025MDFSCR9',
        '5552223352',
        'carolina.escobar2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        2,
        'Ricardo',
        'Díaz',
        'Parra',
        '2011-12-03',
        1, -- Masculino
        'DIPR111203HDFZRC1',
        '5552223353',
        'ricardo.diaz2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        2,
        'Fernanda',
        'Silva',
        'Núñez',
        '2012-01-14',
        2, -- Femenino
        'SINF120114MDFVLR1',
        '5552223354',
        'fernanda.silva2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    ),
    (
        2,
        'Gabriel',
        'Pérez',
        'Méndez',
        '2010-04-05',
        1, -- Masculino
        'PEMG100405HDFRZ12',
        '5552223355',
        'gabriel.perez2023@example.com',
        NULL,
        FALSE,
        NOW (),
        NOW ()
    );