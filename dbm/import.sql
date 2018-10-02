drop table if exists plant_log;
drop table if exists plant;
drop table if exists user;

create table user(
	user_id int unsigned not null auto_increment,
    user_email varchar (50) not null,
    user_password varchar (30) not null,
    kakaotalk_id varchar (30),
    primary key (user_id)
);

create table plant (
	plant_id int unsigned not null auto_increment,
    owner_id int unsigned,
    primary key (plant_id),
    foreign key (owner_id)
		references user (user_id)
        on update cascade on delete set null
);

create table plant_log (
	plant_id int unsigned,
    recorded_date timestamp not null,
    illumination_level float,
    temperature_level float,
    moisture_level float,
    primary key (plant_id, recorded_date),
	foreign key (plant_id)
        references plant (plant_id)
        on update cascade on delete cascade
);