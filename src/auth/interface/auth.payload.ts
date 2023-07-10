import { PartialType } from "@nestjs/mapped-types";
import { Auth } from "../entities/auth.entity";
import { Injectable } from "@nestjs/common";


export class AuthPayload extends PartialType(Auth) {}
