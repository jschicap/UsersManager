import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
  import {CreateUserDto, UpdateUserDto } from '../dto/user.dto';
  import { User } from '../interfaces/user.interface';
  import { UserService } from '../services/users.service';
  
  @Controller('api/v1/Users')
  export class UsersController {
    constructor(private readonly userService: UserService) {}
  
    @Post() 
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createTaskDto: CreateUserDto): Promise<User> {
      return this.userService.create(createTaskDto);
    }
  
    @Get()
    async findAll(): Promise<User[]> {
      return this.userService.findAll();
    }
  
    @Get(':id')
    async findById(@Param('id') id: string): Promise<User> {
      return this.userService.findOne(id);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateTaskDto: UpdateUserDto,
    ): Promise<User> {
      return this.userService.update(id, updateTaskDto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: string): Promise<void> {
      return this.userService.delete(id);
    }
  }
  