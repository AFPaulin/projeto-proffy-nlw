// tem que colocar async para poder usar await
module.exports = async function (db,{proffyValue,classValue,classScheduleValues}) {
    //inserir dados na table de teachers - await esperar banco de dados rodar para ir para 
    //proxima linha
    
    const insertedProffy = await db.run(`
        INSERT INTO proffys (
            name,
            avatar,
            whatsapp,
            bio
        ) VALUES (
            "${proffyValue.name}",
            "${proffyValue.avatar}",
            "${proffyValue.whatsapp}",
            "${proffyValue.bio}"
        );
    `)

    const proffy_id = insertedProffy.lastID

    //inserir dados na tabela classes
    const insertedClass = await db.run(`
    INSERT INTO classes (
        subject,
        cost,
        proffy_id
    ) VALUES (
        "${classValue.subject}",
        "${classValue.cost}",
        "${proffy_id}"
        
    );
`)

    const class_id = insertedClass.lastID

    // inserir dados na tabella class_schedule
    // map função parecida com forEach so que alem de fazer todas interações
    // retorna um array
    const insertedAllClassScheduleValues = classScheduleValues.map((classScheduleValue) => {
        return db.run(`
            INSERT INTO class_schedule (
                class_id,
                weekday,
                time_from,
                time_to
            ) VALUES (
                "${class_id}",
                "${classScheduleValue.weekday}",
                "${classScheduleValue.time_from}",
                "${classScheduleValue.time_to}"
            );
        `)
    })
    


    // aqui vou executar todos os db.runs() das class_schedules
    await Promise.all(insertedAllClassScheduleValues)


}